class Plugins::CamaContactForm::FrontController < CamaleonCms::Apps::PluginsFrontController
  include Plugins::CamaContactForm::MainHelper
  include Plugins::CamaContactForm::ContactFormControllerConcern
  skip_before_action :verify_authenticity_token
  respond_to :html, :js
  
  # here add your custom functions
  def save_form
    flash[:contact_form] = {}
    @form = current_site.contact_forms.find_by_id(params[:id])
    fields = params[:fields]
    errors = []
    success = []

    args = {form: @form, values: fields, flag: true}; hooks_run("contact_form_before_submit", args)
    if args[:flag]
      perform_save_form(@form, fields, success, errors)
      if success.present?
        flash[:contact_form][:notice] = success.join('<br>')
      else
        flash[:contact_form][:error] = errors.join('<br>')
        flash[:values] = fields.delete_if{|k, v| v.class.name == 'ActionDispatch::Http::UploadedFile' }
      end
    end
    respond_to do |format|
      format.html do
        if @form.the_settings[:railscf_campaign][:redirected] == "true" && @form.the_settings[:railscf_campaign][:redirect_to].present?
          flash.discard(:contact_form)
          redirect_to @form.the_settings[:railscf_campaign][:redirect_to]
        else
          redirect_to request.referrer
        end
      end
      format.json { render(json: flash.discard(:contact_form).to_hash) }
      format.js do
        @message = flash[:contact_form]
      end
    end
  end

end