Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, ENV['FACEBOOK_APP_ID'], ENV['FACEBOOK_SECRET']
end

# config.omniauth :twitter, ENV["TWITTER_CONSUMER_KEY"], ENV["TWITTER_CONSUMER_SECRET"]
#   config.omniauth :facebook, ENV['FACEBOOK_APP_ID'], ENV['FACEBOOK_SECRET'],
#     :secure_image_url => 'true', :image_size => 'large'
#   config.omniauth :google_oauth2, ENV["GOOGLE_APP_ID"], ENV["GOOGLE_APP_SECRET"],
#     { :image_size => 200 }
