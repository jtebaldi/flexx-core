namespace :camaleon_cms do
  desc 'Generate thumbnails for uploaded files'
  task generate_thumbnails: :environment do
    include CamaleonCms::CamaleonHelper
    include CamaleonCms::HooksHelper
    include CamaleonCms::SiteHelper
    include CamaleonCms::PluginsHelper
    include CamaleonCms::ThemeHelper
    include CamaleonCms::UploaderHelper
    include Rails.application.routes.url_helpers
    $current_site = CamaleonCms::Site.find(ENV['site_id'].to_i)
    cama_uploader_init_connection
    @fog_connection_bucket_dir.files.all.each do |file|
      puts file.inspect
      cama_uploader_generate_thumbnail(file.key, file.key, "")
    end
  end

  desc "Update admin roles"
  task update_admin_roles: :environment do
    admin_role = CamaleonCms::Meta.where(object_class: "UserRole", key: "_manager_1").first
    # admin_role.value = '{"media":1,"comments":1,"themes":1,"widgets":1,"nav_menu":1,"plugins":1,"users":1,"settings":1,"theme_settings":1, "leads":1, "campaigns":0, "goals":0, "templates":0}'
    admin_role.value = {
      media: 1,
      comments: 1,
      themes: 1,
      widgets: 1,
      nav_menu: 1,
      plugins: 1,
      users: 1,
      settings: 1,
      theme_settings: 1,
      leads: 1,
      campaigns: 1,
      goals: 1,
      templates: 1
    }.to_json
    admin_role.save
  end
end
