class CamaleonCms::HtmlMailer < ActionMailer::Base
  include CamaleonCms::SiteHelper
  include CamaleonCms::HooksHelper
  include CamaleonCms::PluginsHelper
  #include ApplicationHelper
  default from: "RYNGER <ryngerco@gmail.com>"
  after_action :set_delivery_options

  # content='', from=nil, attachs=[], url_base='', current_site, template_name, layout_name, extra_data, format, cc_to
  def sender(email, subject='Hello', data = {})
    data = data.to_sym
    if data[:current_site].present?
      if data[:current_site].is_a?(Integer)
        data[:current_site] = CamaleonCms::Site.find(data[:current_site]).decorate
      end
    else
      data[:current_site] = CamaleonCms::Site.main_site.decorate
    end
    @current_site = data[:current_site]
    data = {
      cc_to: @current_site.get_option("email_cc", '').split(','),
      from: @current_site.get_option("email_from") || @current_site.get_option("email"),
      template_name: 'mailer',
      layout_name: 'camaleon_cms/mailer',
      format: 'html',
    }.merge(data)
    data[:cc_to] = [data[:cc_to]] if data[:cc_to].is_a?(String) || !data[:cc_to].present?

    mail_data = {to: email, subject: subject}
    if @current_site.get_option("mailer_enabled") == 1
      mail_data[:delivery_method] = :smtp
      mail_data[:delivery_method_options] = {
        # user_name: @current_site.get_option("email_username"),
        # password: @current_site.get_option("email_pass"),
        # address: @current_site.get_option("email_server"),
        # port: @current_site.get_option("email_port"),
        # domain: (@current_site.the_url.to_s.parse_domain rescue "localhost"),
        # authentication: "plain",
        # enable_starttls_auto: true,
        user_name: ENV['MAILGUN_UN'],
        password: ENV['MAILGUN_PW'],
        address: ENV['MAILGUN_ADDRESS'],
        port: ENV['MAILGUN_PORT'],
        domain: ENV['MAILGUN_DOMAIN'],
        authentication: "plain",
        enable_starttls_auto: true,
      }
    end
    mail_data[:cc] = data[:cc_to].clean_empty.join(",") if data[:cc_to].present?
    mail_data[:from] = data[:from] if data[:from].present?
    
    data[:mail_data] = mail_data
    hooks_run('email_late', data)
    
    @subject = subject
    @html = data[:content]
    @url_base = data[:url_base]
    @extra_data = data[:extra_data]

    views_dir = "app/apps/"
    self.prepend_view_path(File.join($camaleon_engine_dir, views_dir).to_s)
    self.prepend_view_path(Rails.root.join(views_dir).to_s)

    theme = @current_site.get_theme
    lookup_context.prefixes.prepend("themes/#{theme.slug}") if theme.settings["gem_mode"]
    lookup_context.prefixes.prepend("themes/#{theme.slug}/views") unless theme.settings["gem_mode"]
    lookup_context.use_camaleon_partial_prefixes = true
    ((data[:files] || []) + (data[:attachments] || [])).each{ |attach|
      if File.exist?(attach) && !File.directory?(attach)
        attachments["#{File.basename(attach)}"] = File.open(attach, 'rb') { |f| f.read }
      else
        Rails.logger.error "CMS - File attached in the email doesn't exist: #{attach}".cama_log_style(:red)
      end
    }

    layout = data[:layout_name].present? ? data[:layout_name] : false
    if data[:template_name].present? # render email with template
      mail(mail_data) { |format| format.html { render data[:template_name], layout: layout } } if data[:format] == "html"
      mail(mail_data) { |format| format.text { render data[:template_name], layout: layout } } if data[:format] == "txt"
    else # inline render content
      mail(mail_data) { |format| format.html { render inline: @html, layout: layout } } if data[:format] == "html"
      mail(mail_data) { |format| format.text { render inline: @html, layout: layout } } if data[:format] == "txt"
    end
    mail(mail_data) unless data[:format].present?
  end

  private
  # set default settings configured on admin panel
  def set_delivery_options
    if @current_site.get_option("mailer_enabled") == 1
      mail.perform_deliveries = true
    end
  end
end