require 'sass'
require 'normalize-scss'
require 'bourbon'
require 'neat'

module BaselineScss
  if defined?(Rails) && defined?(Rails::Engine)
    class Engine < ::Rails::Engine
      config.assets.paths << File.expand_path('../../src', __FILE__)
    end
  else
    Sass.load_paths << File.expand_path('../../src/scss', __FILE__)
  end
end