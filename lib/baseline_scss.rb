module BaselineScss
  if defined?(Rails) && defined?(Rails::Engine)
    class Engine < ::Rails::Engine
      initializer 'baseline-scss.paths', group: :all do |app|
        app.config.assets.paths << File.expand_path('../src', __dir__)
      end
    end
  else
    begin
      require 'sass'

      Sass.load_paths << File.expand_path('../src', __dir__)
    rescue LoadError
    end
  end
end
