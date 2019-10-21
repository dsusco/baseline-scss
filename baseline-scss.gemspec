Gem::Specification.new do |s|
  s.authors = ['David Susco']
  s.files = `git ls-files`.split("\n")
  s.name = 'baseline-scss'
  s.summary = 'A CSS and JavaScript framework for mobile first web projects.'
  s.version = '0.2.12'

  s.description = 'A Sass theme built on Normalize.css, Bourbon and Neat with some accessible jQuery plugins thrown in.'
  s.email = ['dsusco@gmail.com']
  s.homepage = 'https://github.com/dsusco/baseline-scss'
  s.license = 'ISC'
  s.metadata = {}

  s.add_runtime_dependency('sass', '~> 3.7', '>= 3.7.4')
  s.add_runtime_dependency('sprockets', '~> 3.7', '>= 3.7.2')
  s.add_runtime_dependency('normalize-scss', '~> 7.0', '>= 7.0.1')
  s.add_runtime_dependency('bourbon', '~> 6.0', '>= 6.0.0')
  s.add_runtime_dependency('neat', '~> 4.0', '>= 4.0.0')
end
