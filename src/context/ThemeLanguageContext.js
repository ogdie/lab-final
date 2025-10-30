import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';

// 1. Criação do Contexto
export const ThemeLanguageContext = createContext();

// Função de Estilo que já usamos no Settings.js
const applyGlobalStyles = (theme) => {
    const isDark = theme === 'dark';
    const backgroundPrimary = isDark ? '#18191a' : '#f0f2f5';
    const textPrimary = isDark ? '#e4e6eb' : '#1d2129';
    document.body.style.backgroundColor = backgroundPrimary;
    document.body.style.color = textPrimary;
};

// 2. Criação do Provedor (Provider)
export const ThemeLanguageProvider = ({ children }) => {
    const [theme, setThemeState] = useState('light');
    const [language, setLanguageState] = useState('pt');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const savedLanguage = localStorage.getItem('language') || 'pt';
        setThemeState(savedTheme);
        setLanguageState(savedLanguage);
        applyGlobalStyles(savedTheme);
    }, []);

    const setTheme = useCallback((newTheme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
        applyGlobalStyles(newTheme);
    }, []);

    const setLanguage = useCallback((newLang) => {
        setLanguageState(newLang);
        localStorage.setItem('language', newLang);
    }, []);

    const translations = {
        pt: {
            // ▼ ADIÇÕES PARA A SIDEBAR
            connections: 'Seguidores',
            Connections: 'Seguidores',
            'conexões': 'Seguidores',
            'Conexões': 'Seguidores',
            conexoes: 'Seguidores',
            Conexoes: 'Seguidores',
            // ▲

            search_placeholder: 'Buscar posts e usuários...',
            clear: 'Limpar',
            search: 'Buscar',
            notifications: 'Notificações',
            connection_followers: 'Solicitações de Seguidores',
            no_requests: 'Nenhuma solicitação pendente',
            accept: 'Aceitar',
            decline: 'Recusar',
            logout: 'Sair',
            chat: 'Chat',
            forum: 'Fórum',
            settings: 'Configurações',
            close: 'Fechar',
            no_notifications: 'Sem notificações',
            likes_post: 'curtiu seu post',
            comments_post: 'comentou em seu post',
            connection_request: 'solicitou para te seguir',
            connection_accepted: 'aceitou te seguir',
            follower_notifications: 'Novos Seguidores',
            started_following_you: 'começou a te seguir',
            footer_rights: '© 2025 Codemia. Todos os direitos reservados.',
            create_post: 'Criar Post',
            what_are_you_thinking: 'O que você está pensando?',
            image_url_optional: 'URL da imagem (opcional)',
            cancel: 'Cancelar',
            publish: 'Publicar',
            warning: 'Aviso',
            confirm: 'Confirmar',
            send: 'Enviar',
            type_a_message: 'Digite uma mensagem...',
            comments: 'comentários',
            like: 'Curtir',
            comment: 'Comentar',
            add_a_comment: 'Adicione um comentário...',
            see_more: '... ver mais',
            see_less: ' ver menos',
            network_user: 'Usuário da Rede',
            user: 'Usuário',
            content_alt: 'Conteúdo',
            member_of_network: 'Membro da Rede',
            reply: 'Responder',
            delete_confirm: 'Tem certeza que deseja deletar este comentário?',
            delete: 'Deletar',
            edit_profile: 'Editar Perfil',
            name: 'Nome',
            bio_label: 'Resumo/Bio',
            bio_placeholder: 'Descreva sua experiência profissional e objetivos...',
            profile_picture_url: 'Foto de Perfil (URL)',
            example_url: 'https://exemplo.com/foto.jpg',
            user_type: 'Tipo de Usuário',
            institution: 'Instituição',
            save: 'Salvar',
            edit_post: 'Editar Post',
            delete_post: 'Excluir Post',
            follow: 'Seguir',
            unfollow: 'Deixar de seguir',
            share: 'Compartilhar',
            twitter: 'Twitter',
            facebook: 'Facebook',
            linkedin: 'LinkedIn',
            whatsapp: 'WhatsApp',
            copy_link: 'Copiar Link',
            success: 'Sucesso',
            link_copied: '✅ Link copiado para a área de transferência!',
            topic_no_name: 'Tópico sem nome',
            no_description: 'Sem descrição',
            no_category: 'Sem categoria',
            posts_label: 'posts',
            view_discussion: 'Ver Discussão →',
            create_new_topic: 'Criar Novo Tópico',
            topic_name: 'Nome do Tópico',
            description_optional: 'Descrição (opcional)',
            create: 'Criar',
            xp: 'XP',
            loading: 'Carregando...',
            error_loading_posts: 'Não foi possível carregar os posts.',
            empty_feed: 'Nenhum post no feed ainda.',
            empty_feed_hint: 'Siga outros usuários ou publique algo para começar!',
            start_post: 'Iniciar uma publicação',
            search_results: 'Resultados da busca',
            no_users_found: 'Nenhum usuário encontrado',
            view_profile: 'Ver Perfil',
            messages_title: 'Mensagens',
            no_conversations: 'Nenhuma conversa ainda',
            no_messages: 'Sem mensagens',
            user_not_found: 'Usuário não encontrado.',
            error_loading_profile: 'Não foi possível carregar o perfil.',
            followers_label: 'Seguidores',
            following_label: 'Seguindo',
            followers: 'Seguidores',
        },
        en: {
            // ▼ ADIÇÕES PARA A SIDEBAR
            connections: 'Followers',
            Connections: 'Followers',
            // ▲

            search_placeholder: 'Search posts and users...',
            clear: 'Clear',
            search: 'Search',
            notifications: 'Notifications',
            connection_notifications: 'Follower Requests',
            no_requests: 'No pending requests',
            accept: 'Accept',
            decline: 'Decline',
            logout: 'Logout',
            chat: 'Chat',
            forum: 'Forum',
            settings: 'Settings',
            close: 'Close',
            no_notifications: 'No notifications',
            likes_post: 'liked your post',
            comments_post: 'commented on your post',
            connection_request: 'requested to follow you',
            connection_accepted: 'accepted to follow you',
            follower_notifications: 'New Followers',
            started_following_you: 'started following you',
            footer_rights: '© 2025 Codemia. All rights reserved.',
            create_post: 'Create Post',
            what_are_you_thinking: 'What are you thinking?',
            image_url_optional: 'Image URL (optional)',
            cancel: 'Cancel',
            publish: 'Publish',
            warning: 'Notice',
            confirm: 'Confirm',
            send: 'Send',
            type_a_message: 'Type a message...',
            comments: 'comments',
            like: 'Like',
            comment: 'Comment',
            add_a_comment: 'Add a comment...',
            see_more: '... see more',
            see_less: ' see less',
            network_user: 'Network User',
            user: 'User',
            content_alt: 'Content',
            member_of_network: 'Network Member',
            reply: 'Reply',
            delete_confirm: 'Are you sure you want to delete this comment?',
            delete: 'Delete',
            edit_profile: 'Edit Profile',
            name: 'Name',
            bio_label: 'Summary/Bio',
            bio_placeholder: 'Describe your professional experience and goals...',
            profile_picture_url: 'Profile Picture (URL)',
            example_url: 'https://example.com/photo.jpg',
            user_type: 'User Type',
            institution: 'Institution',
            save: 'Save',
            edit_post: 'Edit Post',
            delete_post: 'Delete Post',
            follow: 'Follow',
            unfollow: 'Unfollow',
            share: 'Share',
            twitter: 'Twitter',
            facebook: 'Facebook',
            linkedin: 'LinkedIn',
            whatsapp: 'WhatsApp',
            copy_link: 'Copy Link',
            success: 'Success',
            link_copied: '✅ Link copied to clipboard!',
            topic_no_name: 'Topic without name',
            no_description: 'No description',
            no_category: 'No category',
            posts_label: 'posts',
            view_discussion: 'View Discussion →',
            create_new_topic: 'Create New Topic',
            topic_name: 'Topic Name',
            description_optional: 'Description (optional)',
            create: 'Create',
            xp: 'XP',
            loading: 'Loading...',
            error_loading_posts: 'Could not load posts.',
            empty_feed: 'No posts in the feed yet.',
            empty_feed_hint: 'Follow other users or publish something to start!',
            start_post: 'Start a post',
            search_results: 'Search results',
            no_users_found: 'No users found',
            view_profile: 'View Profile',
            messages_title: 'Messages',
            no_conversations: 'No conversations yet',
            no_messages: 'No messages',
            user_not_found: 'User not found.',
            error_loading_profile: 'Could not load the profile.',
            followers_label: 'Followers',
            following_label: 'Following',
            followers: 'Followers',
        }
    };

    const t = useCallback((key) => {
        const table = translations[language] || translations.pt;
        return table[key] || key;
    }, [language]);

    const contextValue = {
        theme,
        setTheme,
        language,
        setLanguage,
        isDark: theme === 'dark',
        t,
    };

    return (
        <ThemeLanguageContext.Provider value={contextValue}>
            {children}
        </ThemeLanguageContext.Provider>
    );
};

// 3. Hook Customizado para usar o Contexto facilmente
export const useThemeLanguage = () => {
    return useContext(ThemeLanguageContext);
};
