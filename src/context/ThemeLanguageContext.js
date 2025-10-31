import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';

// 1. Criação do Contexto
export const ThemeLanguageContext = createContext();

// Função de Estilo que já usamos no Settings.js
const applyGlobalStyles = (theme) => {
    const isDark = theme === 'dark';
    const backgroundPrimary = isDark ? '#1d2226' : '#f0f2f5';
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
            likes_post: 'curtiu sua publicação',
            likes_comment: 'curtiu seu comentário',
            comments_post: 'comentou em sua publicação',
            replied_to_comment: 'respondeu seu comentário',
            likes_post_forum: 'curtiu sua publicação no fórum',
            likes_comment_forum: 'curtiu seu comentário no fórum',
            comments_post_forum: 'comentou em sua publicação no fórum',
            replied_to_comment_forum: 'respondeu seu comentário no fórum',
            mentioned_you_post: 'te marcou em uma publicação',
            mentioned_you_comment: 'te marcou em um comentário',
            connection_request: 'solicitou sua conexão',
            connection_accepted: 'aceitou sua conexão',
            follower_notifications: 'Novos Seguidores',
            started_following_you: 'está seguindo você',
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
            write_a_reply: 'Escreva uma resposta...',
            delete_confirm: 'Tem certeza que deseja deletar este comentário?',
            delete: 'Deletar',
            edit_profile: 'Editar Perfil',
            name: 'Nome',
            bio_label: 'Resumo/Bio',
            bio_placeholder: 'Descreva sua experiência profissional e objetivos...',
            profile_picture_url: 'Foto de Perfil (URL)',
            profile_picture: 'Foto de Perfil',
            select_profile_picture: 'Selecione uma imagem para seu perfil...',
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
            select_image: 'Selecionar Imagem',
            select_image_placeholder: 'Selecione uma imagem para seu perfil...',
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
            click_to_open_chat: 'Clique em uma conversa para abrir o chat! ',
            user_not_found: 'Usuário não encontrado.',
            error_loading_profile: 'Não foi possível carregar o perfil.',
            followers_label: 'Seguidores',
            following_label: 'Seguindo',
            topic_reports_desc: 'Discussão sobre relatórios e métricas de desempenho.',
            topic_fullstack_desc: 'Discussão sobre desenvolvimento com foco em FullStack (Frontend e Backend).',
            topic_c_desc: 'Programação em C: dúvidas, projetos e boas práticas.',
            topic_python_desc: 'Comunidade Python: Data Science, Web, Automação e mais.',
            topic_others_desc: 'Tópicos diversos que não se encaixam em outras categorias.',
            create_new_thread: 'Criar novo tópico',
            thread_title: 'Título',
            thread_description: 'Descrição',
            thread_title_placeholder: 'Digite o título',
            thread_desc_placeholder: 'Escreva a descrição (opcional)',
            no_discussions: 'Nenhuma discussão ainda. Seja o primeiro a criar!',
            type_label: 'Tipo:',
            institution_label: 'Instituição:',
            no_bio: 'Sem bio',
            achievements: 'Conquistas',
            add_achievement: 'Adicionar conquista',
            date_of_birth: 'Data de Nascimento:',
            no_achievements_yet: 'Você ainda não adicionou nenhuma conquista.',
            add_now: 'Adicione agora',
            achievement_type_certification: 'Certificação',
            achievement_type_course: 'Curso',
            achievement_type_project: 'Projeto',
            achievement_type_competition: 'Competição',
            achievement_type_publication: 'Publicação',
            achievement_type_other: 'Outro',
            send_message: 'Enviar mensagem',
            user_type_student: 'Estudante',
            user_type_professor: 'Professor',
            user_type_recruiter: 'Recrutador',
            institution_others: 'Outros',
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
            likes_comment: 'liked your comment',
            comments_post: 'commented on your post',
            replied_to_comment: 'replied to your comment',
            likes_post_forum: 'liked your post in the forum',
            likes_comment_forum: 'liked your comment in the forum',
            comments_post_forum: 'commented on your post in the forum',
            replied_to_comment_forum: 'replied to your comment in the forum',
            mentioned_you_post: 'mentioned you in a post',
            mentioned_you_comment: 'mentioned you in a comment',
            connection_request: 'requested to connect',
            connection_accepted: 'accepted your connection',
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
            write_a_reply: 'Write a reply...',
            delete_confirm: 'Are you sure you want to delete this comment?',
            delete: 'Delete',
            edit_profile: 'Edit Profile',
            name: 'Name',
            bio_label: 'Summary/Bio',
            bio_placeholder: 'Describe your professional experience and goals...',
            profile_picture_url: 'Profile Picture (URL)',
            select_profile_picture: 'Select an image for your profile...',
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
            click_to_open_chat: 'Click a conversation to open the chat!',
            user_not_found: 'User not found.',
            error_loading_profile: 'Could not load the profile.',
            followers_label: 'Followers',
            following_label: 'Following',
            topic_reports_desc: 'Discussion about reports and performance metrics.',
            topic_fullstack_desc: 'Discussion about development focused on FullStack (Frontend and Backend).',
            topic_c_desc: 'C Programming: questions, projects and best practices.',
            topic_python_desc: 'Python Community: Data Science, Web, Automation and more.',
            topic_others_desc: 'Various topics that do not fit into other categories.',
            create_new_thread: 'Create new thread',
            thread_title: 'Title',
            thread_description: 'Description',
            thread_title_placeholder: 'Enter the title',
            thread_desc_placeholder: 'Write the description (optional)',
            no_discussions: 'No discussions yet. Be the first to create one!',
            type_label: 'Type:',
            institution_label: 'Institution:',
            no_bio: 'No bio',
            achievements: 'Achievements',
            add_achievement: 'Add achievement',
            date_of_birth: 'Date of Birth:',
            no_achievements_yet: 'You haven\'t added any achievements yet.',
            add_now: 'Add now',
            achievement_type_certification: 'Certification',
            achievement_type_course: 'Course',
            achievement_type_project: 'Project',
            achievement_type_competition: 'Competition',
            achievement_type_publication: 'Publication',
            achievement_type_other: 'Other',
            send_message: 'Send message',
            user_type_student: 'Student',
            user_type_professor: 'Professor',
            user_type_recruiter: 'Recruiter',
            institution_others: 'Others',
            select_image: 'Select Image',
            select_image_placeholder: 'Select an image for your profile...',
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
