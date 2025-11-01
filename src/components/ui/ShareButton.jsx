import { useState, useEffect, useRef } from "react";
import AlertModal from "./AlertModal";
import { useThemeLanguage } from "../../context/ThemeLanguageContext";
import { FaShare } from 'react-icons/fa';

// Função de estilos dinâmicos baseada no tema
const getStyles = (theme) => {
  const isDark = theme === "dark";
  const textPrimary = isDark ? "#e4e6eb" : "#1d2129";
  const textSecondary = isDark ? "#b0b3b8" : "#606770";
  const background = isDark ? "#2c2f33" : "#ffffff";
  const borderColor = isDark ? "#3e4042" : "#d1d1d1";
  const hoverBg = isDark ? "#3a3b3c" : "#f0f0f0";
  const blueAction = "#4F46E5";

  return {
    shareDropdown: {
      position: "relative",
      display: "inline-block",
    },
    shareButton: {
      background: "none",
      color: textSecondary,
      border: "none",
      cursor: "pointer",
      fontSize: "0.9rem",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "8px 12px",
      margin: "0",
      borderRadius: "6px",
      flex: 1,
      minHeight: "36px",
      transition: "background-color 0.2s ease, color 0.2s ease",
      position: "relative",
    },
    shareMenu: {
      position: "absolute",
      top: "100%",
      right: 0,
      background,
      border: `1px solid ${borderColor}`,
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      zIndex: 1000,
      minWidth: "160px",
      overflow: "hidden",
    },
    shareOption: {
      display: "block",
      width: "100%",
      padding: "0.75rem 1rem",
      background: "none",
      border: "none",
      textAlign: "left",
      cursor: "pointer",
      fontSize: "0.9rem",
      color: textPrimary,
      transition: "background-color 0.2s, color 0.2s",
    },
    shareOptionHover: {
      background: hoverBg,
    },
  };
};

export default function ShareButton({
  post,
  topicId = null,
  icon = <FaShare />,
  style = {},
  theme,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { t } = useThemeLanguage();

  // Se o tema não vier por prop, tenta pegar do contexto
  const { theme: contextTheme } = useThemeLanguage();
  const appliedTheme = theme || contextTheme || "light";

  const styles = getStyles(appliedTheme);

  // 🔹 Referência para detectar cliques fora do menu
  const dropdownRef = useRef(null);

  const handleShare = (platform) => {
    const url = window.location.origin + `/post/${post._id}`;
    const text = `Confira este post no CodeConnect: ${
      post.content?.substring(0, 100) || "Post interessante"
    }...`;

    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(
          text + " " + url
        )}`;
        break;
      case "copy":
        navigator.clipboard
          .writeText(url)
          .then(() => setShowAlert(true))
          .catch(() => console.error("Erro ao copiar link."));
        setShowMenu(false);
        return;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
    setShowMenu(false);
  };

  // ✅ Fecha o menu se clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <div style={{ ...styles.shareDropdown, flex: 1 }} ref={dropdownRef}>
      <button
        style={{
          ...styles.shareButton,
          ...style,
        }}
        onClick={() => setShowMenu(!showMenu)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor =
            getStyles(appliedTheme).shareOptionHover.background;
          e.currentTarget.style.color = "#4F46E5";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color =
            getStyles(appliedTheme).shareButton.color;
        }}
      >
        {icon} {t("share")}
      </button>

      {showMenu && (
        <div style={styles.shareMenu}>
          {["twitter", "facebook", "linkedin", "whatsapp", "copy"].map(
            (platform) => (
              <button
                key={platform}
                onClick={() => handleShare(platform)}
                style={styles.shareOption}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background =
                    getStyles(appliedTheme).shareOptionHover.background)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                {platform === "twitter" && "🐦 "}
                {platform === "facebook" && "📘 "}
                {platform === "linkedin" && "💼 "}
                {platform === "whatsapp" && "📱 "}
                {platform === "copy" && "📋 "}
                {platform === "copy" ? t("copy_link") : t(platform)}
              </button>
            )
          )}
        </div>
      )}

      <AlertModal
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        message={t("link_copied")}
        title={t("success")}
        showCancel={false}
        theme={appliedTheme}
      />
    </div>
  );
}
