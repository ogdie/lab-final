import { useEffect, useMemo, useState } from "react";

export default function FollowButton({
  userId,                            // ID do usuário-alvo
  currentUser,                       // objeto do usuário logado (contém following[])
  initialFollowerCount,              // opcional: seguidores atuais do usuário-alvo
  initialFollowingCount,             // opcional: "seguindo" do usuário atual
  onToggle,                          // async (userId, nextIsFollowing) => { followerCount?, followingCount? }
  onCountsChange                     // opcional: ({ followerCount, followingCount }) => void
}) {
  const initiallyFollowing = useMemo(
    () => Boolean(currentUser?.following?.includes(userId)),
    [currentUser, userId]
  );

  const [isFollowing, setIsFollowing] = useState(initiallyFollowing);
  const [loading, setLoading] = useState(false);

  // Contadores locais opcionais para refletir imediatamente no UI (se fornecidos)
  const [followerCount, setFollowerCount] = useState(initialFollowerCount ?? null);
  const [followingCount, setFollowingCount] = useState(initialFollowingCount ?? null);

  // Se currentUser mudar (refetch/navegação), sincroniza o estado
  useEffect(() => {
    setIsFollowing(initiallyFollowing);
  }, [initiallyFollowing]);

  const handleClick = async () => {
    if (loading) return;

    const nextIsFollowing = !isFollowing;

    // Otimista: ajusta estado e contadores locais já no clique
    setIsFollowing(nextIsFollowing);
    setLoading(true);

    const prevFollower = followerCount;
    const prevFollowing = followingCount;

    if (followerCount != null) {
      setFollowerCount(c => (c ?? 0) + (nextIsFollowing ? 1 : -1));
    }
    if (followingCount != null) {
      setFollowingCount(c => (c ?? 0) + (nextIsFollowing ? 1 : -1));
    }

    try {
      // Pai executa POST/DELETE e pode retornar contadores “oficiais”
      const result = await onToggle?.(userId, nextIsFollowing);

      if (result && (typeof result.followerCount === "number" || typeof result.followingCount === "number")) {
        if (typeof result.followerCount === "number") setFollowerCount(result.followerCount);
        if (typeof result.followingCount === "number") setFollowingCount(result.followingCount);
        onCountsChange?.({
          followerCount: result.followerCount ?? followerCount ?? undefined,
          followingCount: result.followingCount ?? followingCount ?? undefined
        });
      } else {
        // Mesmo sem retorno de contadores, avisa o pai do delta aplicado
        onCountsChange?.({
          followerCount: followerCount ?? undefined,
          followingCount: followingCount ?? undefined
        });
      }
    } catch (err) {
      // Rollback em caso de falha
      setIsFollowing(!nextIsFollowing);
      if (prevFollower != null) setFollowerCount(prevFollower);
      if (prevFollowing != null) setFollowingCount(prevFollowing);
      // Evite alertas barulhentos; deixe para o pai decidir. Aqui apenas repropaga se quiser:
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleFollow}
      style={{
        ...styles.button,
        background: isFollowing ? '#4CAF50' : '#2196F3',
        color: 'white'
      }}
    >
      {isFollowing ? 'Deixar de seguir' : 'Seguir'}
    </button>
  );
}

const styles = {
  wrapper: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  button: {
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "bold",
    color: "white",
    transition: "background 0.2s, opacity 0.2s"
  },
  counters: {
    fontSize: "0.85rem",
    color: "#444"
  }
};
