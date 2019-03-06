require 'sass'
require 'sprockets'
require 'normalize-scss'
require 'bourbon'
require 'neat'

module BaselineScss
  if defined?(Rails) && defined?(Rails::Engine)
    class Engine < ::Rails::Engine
      config.assets.paths << File.expand_path('../../src/js', __FILE__)
      config.assets.paths << File.expand_path('../../src/scss', __FILE__)
    end
  else
    Sprockets.append_path(File.expand_path('../../src/js', __FILE__))
    Sprockets.append_path(File.expand_path('../../src/scss', __FILE__))
    Sass.load_paths << File.expand_path('../../src/scss', __FILE__)
  end
end