
require.config({
    // baseUrl: 'src/js',
    paths: {
      jquery: [
          '//code.jquery.com/jquery-1.9.1.min',
          'lib/jquery.js'
      ],
          
      bootstrap: [
              '//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min',
              'lib/bootstrap'
      ],
      
      Prototype: 'https://ajax.googleapis.com/ajax/libs/prototype/1.7.0.0/prototype',
      Scriptaculous: './scriptaculous' ,//'https://ajax.googleapis.com/ajax/libs/scriptaculous/1.9.0/scriptaculous',
      Cropper: './cropper'
    },
    
});

require(['jquery','bootstrap']);


