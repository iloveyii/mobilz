Mobilz
=======
This is an eCommerce application developed in PHP Yii 2 framework and MySQL.

![Screenshot](http://mobilz.softhem.se/images/screenshot.png)

## What has been done
   * We have developed a backend application in PHP using [Yii 2](https://www.yiiframework.com/) which serves the API requests. 
   * We have developed a frontend application using Html 5, Js, JQuery, Css 3 which is used by the customer.  
   * We have used MySQL database which have all the products and user information. 
   * We have developed required web pages using html 5 and CSS 3 for user login, user sign up and polling on the events.
   
## Development tools
   * We used PhpStorm IDE, git, bitbucket, composer, PHP 7.2, Ubuntu and Apache2 for development environment.
     
## Setup and first run

  * Clone the repository `git clone git@github.com:iloveyii/mobilz.git`.
  * Run composer install `composer install`.
  * Create a database (manually for now) and adjust the database credentials in the `config/app.php` file as per your environment.
  * Run the migrations to create the database table as `./yii migrate/up`.
  * Point web browser to root/frontend/www directory or Create a virtual host using [vh](https://github.com/iloveyii/vh) `vh new mobilz -p ~/sportspoll/backend/src/web`
  * Point web browser to root/backend/www directory or Create a virtual host using [vh](https://github.com/iloveyii/vh) `vh new backend-mobilz -p ~/sportspoll/backend/src/web`
  * Browse to [http://mobilz.loc](http://mobilz.loc) for frontend.
  * Browse to [http://backend-mobilz.loc](http://backend-mobilz.loc) for backend.
  
For more information about using Composer please see its [documentation](http://getcomposer.org/doc/).

## How to use the framework

This framework is very easy to be used. You can create an object of the router by passing a request object to it as shown below.

```
// index.php
require_once 'vendor/autoload.php';
require_once 'config/app.php';

use App\Models\Router;
use App\Models\Request;

/**
 * First create router object with params Request object and default route
 */
$router = new Router(new Request, '/posts/index');

/**
 * Next declare the http methods
 */
$router->get('/posts/index', function ($request) {
    $controller = new \App\Controllers\PostController($request);
    $controller->index();
});
```

DEMO is here [DEMO](http://sportspoll.softhem.se).




DIRECTORY STRUCTURE
-------------------
Bellow is the directory structure used:

```
common
    config/              contains shared configurations
    mail/                contains view files for e-mails
    models/              contains model classes used in both backend and frontend
console
    config/              contains console configurations
    controllers/         contains console controllers (commands)
    migrations/          contains database migrations
    models/              contains console-specific model classes
    runtime/             contains files generated during runtime
frontend
    assets/              contains application assets such as JavaScript and CSS
    config/              contains frontend configurations
    controllers/         contains Web controller classes
    models/              contains frontend-specific model classes
    runtime/             contains files generated during runtime
    views/               contains view files for the Web application
    web/                 contains the entry script and Web resources
    widgets/             contains frontend widgets
vendor/                  contains dependent 3rd-party packages
environments/            contains environment-based overrides
```

## Requirements
   * The application has been tested with apache2 virtual hosts so it is recommended.
   * You need to enable mode rewrite and use the file `.htaccess` in the web directory.
   * Point your web server ( wwwroot ) to backend/src/web directory for the backend application.
   * Make web directory writable for web server user (www-data in apache), to enable logging.
   * Disable displaying errors in config/app.php.
   * PHP 7.2
   * Apache 2
   * MySql 5.6
   
## Testing
  * To run the php unit tests, inside backend/src run `phpunit ` .
  
<i> Web development has never been so fun.</i>  
[Hazrat Ali](http://blog.softhem.se/) 
