module BaselineScss
  if defined?(Jekyll)
    Jekyll::Command.class_eval do
      class << self
        def configuration_from_options(options)
          return options if options.is_a?(Jekyll::Configuration)

          options = Jekyll.configuration(options)

          begin
            options['sass']['load_paths'] << File.expand_path('../src', __dir__)
          rescue
            options.merge({ 'sass' => { 'load_paths' => [File.expand_path('../src', __dir__)] } })
          end

          options
        end
      end
    end
  elsif defined?(Rails) && defined?(Rails::Engine)
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

    begin
      require 'sassc'

      SassC.load_paths << File.expand_path('../src', __dir__)
    rescue LoadError
    end
  end
end
