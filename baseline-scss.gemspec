require 'baseline_scss/version'

Gem::Specification.new do |s|
  s.name = 'baseline-scss'
  s.version = BaselineScss::VERSION
  s.license = 'ISC'
  s.summary = 'Styles for the Baseline Jekyll theme.'
  s.description = 'Styles for the Baseline Jekyll theme.'
  s.authors = ['David Susco']
  s.email = ['dsusco@gmail.com']
  s.files = `git ls-files`.split("\n")
  s.homepage = 'https://github.com/dsusco/baseline-scss'

  s.require_paths = ['lib']

  s.add_development_dependency 'rake'
  s.add_development_dependency 'sass'
end
