from django.urls import path, include
from africa_logistic import views

urlpatterns = [
    path('auth/register/', views.register_user, name='register_user'),
    path('auth/verify-account/', views.verify_account, name='verify_account'),
    path('auth/request-password-reset/', views.request_password_reset, name='request_password_reset'),
    path('auth/reset-password/', views.reset_password, name='reset_password'),
    path('auth/login/', views.login_user, name='login_user'),
    path('auth/logout/', views.logout_user, name='logout_user'),
    path('auth/resend-verification/', views.resend_verification_code, name='resend_verification_code'),
    path('auth/activate-2fa/', views.activate_2FA, name='activate_2FA'),
    path('auth/deactivate-2fa/', views.deactivate_2FA, name='deactivate_2FA'),
    path('auth/login/2fa/', views.send_2FA_after_checking, name='verify_2fa_code'),
    path('auth/login/2fa/verify/', views.check_login_with_2FA, name='check_login_with_2FA'),
    path('auth/resend-2fa/', views.resend_2FA_code, name='resend_2fa_code'),
    path('auth/change-password/', views.change_password, name='change_password'),
    path('ping/', views.ping, name='ping'),
    
    path('user/me/', views.get_connected_user, name='get_connected_user'),
    path('user/me/update/', views.update_infos, name='update_infos'),
    path('user/notifications/preferences/', views.notification_preferences, name='notification_preferences'),

    # Wallet
    path('wallet/me/', views.get_my_wallet, name='get_my_wallet'),
    path('wallet/transactions/', views.get_my_wallet_transactions, name='get_my_wallet_transactions'),
    path('wallet/topup/', views.topup_wallet, name='topup_wallet'),

    # Notifications
    path('notifications/', views.get_my_notifications, name='get_my_notifications'),
    path('notifications/read-all/', views.mark_all_notifications_read, name='mark_all_notifications_read'),
    path('notifications/<str:notif_slug>/read/', views.mark_notification_read, name='mark_notification_read'),

    # Ratings
    path('ratings/', views.rating_view, name='rating_view'),
    path('ratings/me/', views.rating_view, name='get_my_ratings'),
    
    # Exports
    path('reports/client/my-requests.csv', views.export_client_requests, name='export_client_requests'),
    path('reports/transporter/my-missions.csv', views.export_transporter_missions, name='export_transporter_missions'),
    path('reports/admin/requests.csv', views.export_admin_report, name='export_admin_report'),
    path('reports/admin/users.csv', views.export_users_report, name='export_users_report'),
    path('reports/admin/revenue.csv', views.export_revenue_report, name='export_revenue_report'),
    path('reports/admin/transporters.csv', views.export_transporters_report, name='export_transporters_report'),
    path('reports/admin/geographic.csv', views.export_geographic_report, name='export_geographic_report'),
    path('reports/admin/disputes.csv', views.export_disputes_report, name='export_disputes_report'),
    
    path('data-admin/users/', views.get_users_by_data_admin, name='get_users_by_data_admin'),
    path('data-admin/user/<str:user_slug>/alter/', views.alter_user_by_data_admin, name='alter_user_by_data_admin'),
    path('data-admin/user/<str:user_slug>/desactivate/', views.desactivate_user_by_data_admin, name='desactivate_user_by_data_admin'),
    path('data-admin/user/<str:user_slug>/activate/', views.activate_user_by_data_admin, name='activate_user_by_data_admin'),
    path('data-admin/user/<str:user_slug>/delete/', views.delete_user_by_data_admin, name='delete_user_by_data_admin'),
    path('data-admin/user/<str:user_slug>/restore/', views.restore_deleted_user_by_data_admin, name='restore_deleted_user_by_data_admin'),
    path('data-admin/user/<str:user_slug>/', views.get_user_info_by_data_admin, name='get_user_info_by_data_admin'),
    
    path('data-admin/type-document/', views.get_types_legal_document_by_data_admin, name='get_types_legal_document_by_data_admin'),
    path('public/document-types/', views.get_public_document_types, name='get_public_document_types'),
    path('data-admin/type-document/add/', views.add_type_legal_document_by_data_admin, name='add_type_legal_document_by_data_admin'),
    path('data-admin/type-document/<str:type_slug>/alter/', views.alter_type_legal_document_by_data_admin, name='alter_type_legal_document_by_data_admin'),
    path('data-admin/type-document/<str:type_slug>/delete/', views.delete_type_legal_document_by_data_admin, name='delete_type_legal_document_by_data_admin'),
    
    path('legal-document/add/', views.add_legal_document, name='add_legal_document'),
    path('legal-document/<str:doc_slug>/alter/', views.alter_legal_document, name='alter_legal_document'),
    path('legal-document/<str:doc_slug>/delete/', views.delete_legal_document, name='delete_legal_document'),
    path('legal-document/me/', views.get_my_legal_documents, name='get_my_legal_documents'),
    path('legal-document/<str:doc_slug>/', views.get_legal_document_details, name='get_legal_document_details'),
    
    # Not tested yet
    path('legal-document/<str:doc_slug>/validate/', views.validate_document, name='validate_document'),
    
    path('legal-document/user/<str:user_slug>/', views.get_legal_documents_of_user, name='get_legal_documents_of_user'),
    
    
    
    # Google OAuth — désactivé (OAUTH_CLIENT_ID manquant dans settings.py)
    # Décommenter après avoir configuré OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REDIRECT_URI
    # path('accounts/oauth/login/', views.oauth_login, name="oauth_login"),
    # path('accounts/oauth/callback/', views.oauth_callback, name="oauth_callback"),
    
    ################################################################################################################################
    
    # ==================== ROUTES CLIENTS ====================
    
    # Création
    path('demandes/create/', views.create_transport_request, name='create_demande'),
    
    # Liste et historique
    path('demandes/mes-demandes/', views.get_my_requests, name='mes_demandes'),
    path('demandes/mes-demandes-assignees/', views.get_my_assigned_requests, name='mes_demandes_assignees'),
    path('demandes/disponibles/', views.get_available_requests, name='demandes_disponibles'),
    path('demandes/', views.get_transport_requests, name='liste_demandes'),
    
    # Détails, modification, annulation, suppression
    path('demandes/<str:request_slug>/', views.get_transport_request_detail, name='detail_demande'),
    path('demandes/<str:request_slug>/update/', views.update_transport_request, name='update_demande'),
    path('demandes/<str:request_slug>/annuler/', views.cancel_request, name='annuler_demande'),
    path('demandes/<str:request_slug>/delete/', views.delete_transport_request, name='delete_demande'),
    path('demandes/<str:request_slug>/documents/', views.get_request_documents, name='get_request_documents'),
    path('demandes/<str:request_slug>/documents/upload/', views.upload_request_document, name='upload_request_document'),
    path('demandes/documents/<str:document_slug>/delete/', views.delete_document, name='delete_request_document'),
    
    # ==================== ROUTES ADMIN ====================
    
    # Liste toutes les demandes
    path('admin/demandes/', views.get_all_requests_by_admin, name='admin_all_demandes'),
    
    # Gestion du statut et assignation
    path('admin/demandes/<str:request_slug>/statut/', views.update_status, name='admin_update_statut'),
    path('admin/demandes/<str:request_slug>/assign/', views.assign_transporter, name='assign_transporter'),
    path('admin/demandes/<str:request_slug>/associate-tracker/', views.associate_tracker, name='associate_tracker'),
    
    # Statistiques et KPIs
    path('admin/statistics/', views.get_statistics, name='admin_statistics'),
    path('admin/kpis/', views.get_admin_kpis, name='admin_kpis'),
    path('admin/finance/wallets/', views.get_all_wallets_by_admin, name='admin_wallets'),
    path('admin/finance/transactions/', views.get_all_transactions_by_admin, name='admin_transactions'),
    
    # Suppression définitive et restauration
    path('admin/demandes/<str:request_slug>/hard-delete/', views.delete_transport_request, name='admin_hard_delete'),
    path('admin/demandes/<str:request_slug>/restore/', views.restore_deleted_request, name='admin_restore'),
    
    # ==================== ROUTES VÉHICULES ====================
    
    # CRUD véhicules
    path('vehicles/', views.get_vehicles, name='get_vehicles'),
    path('vehicles/create/', views.create_vehicle, name='create_vehicle'),
    path('vehicles/<str:vehicle_slug>/', views.get_vehicle_detail, name='get_vehicle_detail'),
    path('vehicles/<str:vehicle_slug>/update/', views.update_vehicle, name='update_vehicle'),
    path('vehicles/<str:vehicle_slug>/delete/', views.delete_vehicle, name='delete_vehicle'),
    
    # Documents véhicules
    path('vehicles/<str:vehicle_slug>/documents/', views.get_vehicle_documents, name='get_vehicle_documents'),
    path('vehicles/<str:vehicle_slug>/documents/add/', views.add_vehicle_document, name='add_vehicle_document'),
    path('vehicles/documents/<str:doc_slug>/update/', views.update_vehicle_document, name='update_vehicle_document'),
    path('vehicles/documents/<str:doc_slug>/delete/', views.delete_vehicle_document, name='delete_vehicle_document'),
    
    # ==================== VALIDATION TRANSPORTEURS ====================
    
    path('admin/transporters/pending/', views.get_pending_transporters, name='get_pending_transporters'),
    path('admin/transporters/<str:transporter_slug>/approve/', views.approve_transporter, name='approve_transporter'),
    path('admin/transporters/<str:transporter_slug>/reject/', views.reject_transporter, name='reject_transporter'),
    path('admin/transporters/<str:transporter_slug>/', views.get_transporter_details, name='get_transporter_details'),

    # ==================== DISPUTES ====================

    path('disputes/', views.get_disputes, name='get_disputes'),
    path('disputes/create/', views.create_dispute, name='create_dispute'),
    path('disputes/<str:dispute_slug>/', views.get_dispute_detail, name='get_dispute_detail'),
    path('disputes/<str:dispute_slug>/update/', views.update_dispute, name='update_dispute'),
    path('disputes/<str:dispute_slug>/take/', views.take_dispute, name='take_dispute'),
    path('disputes/<str:dispute_slug>/messages/', views.add_dispute_message, name='add_dispute_message'),

    # ==================== WITHDRAWAL REQUESTS ====================

    path('wallet/withdrawal/', views.create_withdrawal_request, name='create_withdrawal_request'),
    path('wallet/my-withdrawals/', views.get_my_withdrawals, name='get_my_withdrawals'),
    path('admin/withdrawals/', views.get_all_withdrawals_by_admin, name='get_all_withdrawals_by_admin'),
    path('admin/withdrawals/<str:withdrawal_slug>/process/', views.process_withdrawal_by_admin, name='process_withdrawal_by_admin'),

    # ==================== MODERATEUR ====================

    path('moderator/requests/', views.moderator_get_requests, name='moderator_get_requests'),
    path('moderator/requests/<str:request_slug>/validate/', views.moderator_validate_request, name='moderator_validate_request'),
    path('moderator/requests/<str:request_slug>/reject/', views.moderator_reject_request, name='moderator_reject_request'),
    path('moderator/requests/<str:request_slug>/assign/', views.moderator_assign_transporter, name='moderator_assign_transporter'),
    path('moderator/transporters/available/', views.get_available_transporters, name='get_available_transporters'),
    path('moderator/stats/', views.get_moderator_stats, name='get_moderator_stats'),
    path('moderator/users/', views.get_users_for_moderator, name='get_users_for_moderator'),

    # ==================== PLATFORM SETTINGS ====================

    path('admin/settings/', views.get_platform_settings, name='get_platform_settings'),
    path('admin/settings/update/', views.update_platform_settings, name='update_platform_settings'),
]