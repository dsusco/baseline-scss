$:.push File.expand_path('../lib', __FILE__)
require 'baseline_scss/version'

Gem::Specification.new do |s|
  s.name        = 'baseline-scss'
  s.version     = BaselineScss::VERSION
  s.license     = 'ISC'
  s.summary     = 'Styles for the Baseline Jekyll theme.'
  s.description = 'Styles for the Baseline Jekyll theme.'
  s.authors     = ['David Susco']
  s.files       = `git ls-files`.split("\n")
  s.homepage    = 'https://github.com/dsusco/baseline-scss'

  s.require_paths = ['lib']

  s.add_development_dependency 'rake'
end
