module Themes::Bezel::MainHelper
  def self.included(klass)
    klass.helper_method [:business_fb_url] rescue ""
    klass.helper_method [:business_isnta_url] rescue ""
    klass.helper_method [:business_twitter_url] rescue ""
    klass.helper_method [:business_youtube_url] rescue ""
  end

  def bezel_settings(theme)
    # callback to save custom values of fields added in my_theme/views/admin/settings.html.erb
  end

  # callback called after theme installed
  def bezel_on_install_theme(theme)
    return if theme.get_option('installed_at').present? # it was installed (re enabling...)
    
    unless theme.get_field_groups.where(slug: "fields").any?
      gr = theme.add_field_group({name: "Site", slug: "fields", description: ""})
      gr.add_field({"name"=>"Logo dark", "slug"=>"logo_dark"},{field_key: "image"})
      gr.add_field({"name"=>"Logo light", "slug"=>"logo_light"},{field_key: "image"})
      gr.add_field({"name"=>"Accent color", "slug"=>"accent_color"},{field_key: "colorpicker"})
      # group.add_field({"name"=>"Links color", "slug"=>"links_color"},{field_key: "colorpicker"})
    end
    
    # Business Info
    gr = theme.add_field_group({name: "Business Info", slug: "business"})
    gr.add_field({"name"=>"Phone", "slug"=>"business_phone"},{field_key: "text_box"})
    gr.add_field({"name"=>"Email", "slug"=>"business_email"},{field_key: "text_box"})
    gr.add_field({"name"=>"Address", "slug"=>"business_address"},{field_key: "text_box"})
    gr.add_field({"name"=>"Map URL", "slug"=>"business_map_url"},{field_key: "url"})
    
    # Social
    gr = theme.add_field_group({name: "Social", slug: "social"})
    gr.add_field({"name"=>"Facebook Username", "slug"=>"social_fb"},{field_key: "text_box"})
    gr.add_field({"name"=>"Instagram Username", "slug"=>"social_insta"},{field_key: "text_box"})
    gr.add_field({"name"=>"Twitter Username", "slug"=>"social_twitter"},{field_key: "text_box"})
    gr.add_field({"name"=>"YouTube Username", "slug"=>"social_youtube"},{field_key: "text_box"})
    
    # Marketing, Sales and Analytics
    gr = theme.add_field_group({name: "Marketing, Sales and Analytics", slug: "analytics"})
    gr.add_field({"name"=>"Google Analytics ID", "slug"=>"analytics_google"},{field_key: "text_box"})
    gr.add_field({"name"=>"Facebook Pixel ID", "slug"=>"analytics_fb_pixel"},{field_key: "text_box"})

    
    # # Sample Meta Value
    # theme.set_meta("installed_at", Time.current.to_s) # save a custom value
  end

  # callback executed after theme uninstalled
  def bezel_on_uninstall_theme(theme)
  end
  
  # Returns the Facebook URL based on the FB username
  def business_fb_url
    base_url = 'https://www.facebook.com/'
    if current_theme.the_field('social_fb').present?
      base_url + current_theme.the_field('social_fb').to_s
    else
      base_url
    end
  end
  
  def business_isnta_url
    base_url = 'https://www.instagram.com/'
    if current_theme.the_field('social_insta').present?
      base_url + current_theme.the_field('social_insta').to_s
    else
      base_url
    end
  end
  
  def business_twitter_url
    base_url = 'https://twitter.com/'
    if current_theme.the_field('social_twitter').present?
      base_url + current_theme.the_field('social_twitter').to_s
    else
      base_url
    end
  end
  
  def business_youtube_url
    base_url = 'https://www.youtube.com/user/'
    if current_theme.the_field('social_youtube').present?
      base_url + current_theme.the_field('social_youtube').to_s
    else
      base_url
    end
  end
  
  def foundry_social_urls
    res = []
    if(fb = current_theme.the_field('social_fb')).present?
      res << "<li><a href='#{fb}' class='facebook'> </a></li>"
    end

    if(insta = current_theme.the_field('social_insta')).present?
      res << "<li><a href='#{insta}' class='p'> </a></li>"
    end

    if(tw = current_theme.the_field('social_tw')).present?
      res << "<li><a href='#{tw}' class='twitter'> </a></li>"
    end
    res.join(' ')
  end
end
