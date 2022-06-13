<?php
// FRONT CONTROLLER
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();
// Подключениефайловсистемы
define('ROOT', dirname(__FILE__));
require_once(ROOT . '/components/Autoload.php');
// Вызов Router
$router = new Router();
$router->run();
?>
//ЛистингА.2 – Папка components
<?php
/**
* Функция __autoload для автоматического подключения классов
*/
function __autoload($class_name)
{
// Массив папок, в которых могут находиться необходимые классы
$array_paths = array(
'/models/',
'/components/',
'/controllers/'
);
// Проходимпомассивупапок
foreach ($array_paths as $path) {
// Формируем имя и путь к файлу с классом
$path = ROOT . $path . $class_name . '.php';
// Если такой файл существует, подключаем его
if (is_file($path)) {
include_once $path;
}
}
}
?>
<?php
class Db
{
public static function getConnection()
{
$paramsPath = ROOT . '/config/db_params.php';
$params = include($paramsPath);
$dsn = "mysql:host={$params['host']};dbname={$params['dbname']}";
$db = new PDO($dsn, $params['user'], $params['password']);
$db->exec("set names utf8");
return $db;
}
}
?>
<?php
class Router
{
private $routes;
public function __construct()
{
$routesPath = ROOT . '/config/routes.php';
$this->routes = include($routesPath);
}
private function getURI()
{
if (!empty($_SERVER['REQUEST_URI'])) {
return trim($_SERVER['REQUEST_URI'], '/');
}
}
public function run()
{
$uri = $this->getURI();
foreach ($this->routes as $uriPattern => $path) {
if (preg_match("~$uriPattern~", $uri)) {
$internalRoute = preg_replace("~$uriPattern~", $path, $uri);
$segments = explode('/', $internalRoute);
$controllerName = array_shift($segments) . 'Controller';
$controllerName = ucfirst($controllerName);
$actionName = 'action' . ucfirst(array_shift($segments));
$parameters = $segments;
$controllerFile = ROOT . '../controllers/' . $controllerName . '.php';
if (file_exists($controllerFile)) {
include_once($controllerFile);
}
$controllerObject = new $controllerName;
$result = call_user_func_array(array($controllerObject, $actionName), $parameters);
if ($result != null) {
break;
}
}
}
}
}
?>
//ЛистингА.3 – Папка config
<?php
return array(
'host' => 'localhost',
'dbname' => 'shop',
'user' => 'root',
'password' => 'root',
);
?>
<?php
return array(
'game/([0-9]+)' => 'product/game/$1',
'catalog' => 'catalog/catalog',
'category/([0-9]+)' => 'catalog/category/$1',
'cart/add/([0-9]+)' => 'cart/add/$1',
'cart/delete/([0-9]+)' => 'cart/delete/$1',
'cart' => 'cart/cart',
'checkout' => 'cart/checkout',
'login' => 'user/login',
'register' => 'user/register',
'logout' => 'user/logout',
'cabinet' => 'cabinet/cabinet',
'edit' => 'cabinet/edit',
'' => 'site/main',
);
ЛистингА.4 – Папка controllers
?><?php
class CabinetController
{
public function actionCabinet()
{
$userId = User::checkLogged();
$user = User::getUserById($userId);
require_once(ROOT . '/views/cabinet/cabinet.php');
return true;
}
public function actionEdit()
{
$userId = User::checkLogged();
$user = User::getUserById($userId);
$email = $user['email'];
$name = $user['name'];
$password = $user['password'];
$result = false;
if (isset($_POST['submit'])) {
$email = $_POST['email'];
$name = $_POST['name'];
$password = $_POST['password'];
$errors = false;
if (User::checkEmail($email)) {
} else {
$errors[] = 'Неправильный email';
}
if (User::checkName($name)) {
} else {
$errors[] = 'Имя не должно быть короче 2-х символов';
}
if (User::checkPassword($password)) {
} else {
$errors[] = 'Пароль не должен быть короче 6-ти символов';
}
if (User::checkEmailExist($email)) {
$errors[] = 'Такой email ужеиспользуется';
}
if ($errors == false) {
//SAVE USER
$result = User::edit($userId, $email, $name, $password);
header("Location: /cabinet");
}
}
require_once(ROOT . '/views/cabinet/edit.php');
return true;
}
}
?><?php
class CartController
{
public function actionCart()
{
$productsInCart = false;
//Получаемданныеизкорзины
$productsInCart = Cart::getProducts();
if ($productsInCart) {
//Получаем полную информацию о товарах для списка
$productsIds = array_keys($productsInCart);
$products = Product::getProductsByIds($productsIds);
//Получаемобщуюстоимостьтоваров
$totalPrice = Cart::getTotalPrice($products);
}
require_once(ROOT . '/views/cart/cart.php');
return true;
}
public static function actionAdd($id)
{
Cart::addProduct($id);
$referrer = $_SERVER['HTTP_REFERER'];
header("Location: $referrer");
}
public function actionDelete($id)
{
//Удаление заданного товара из корзины
Cart::deleteProduct($id);
//Возвращение пользователя в корзину
header("Location: /cart");
}
public static function actionCheckout()
{
$result = false;
if (isset($_POST['submit'])) {
$userName = $_POST['userName'];
$userEmail = $_POST['userEmail'];
$userPurse = $_POST['userPurse'];
$errors = false;
if (!User::checkName($userName)) {
$errors[] = 'Непрравильноеимя';
}
if (!User::checkEmail($userEmail)) {
$errors[] = 'Неправильный email';
}
if ($errors == false) {
$productsInCart = Cart::getProducts();
if (User::isGuest()) {
$userId = 0;
} else {
$userId = User::checkLogged();
}
$result = Sales::save($userName, $userEmail, $userPurse, $userId, $productsInCart);
if ($result) {
Cart::clear();
}
}
} else {
$productsInCart = Cart::getProducts();
if ($productsInCart == false) {
header("Location: /");
} else {
$productsIds = array_keys($productsInCart);
$products = Product::getProductsByIds($productsIds);
$totalPrice = Cart::getTotalPrice($products);
$totalQuantity = Cart::countItems();
$userName = false;
$userEmail = false;
$userPurse = false;
if (User::isGuest()) {
$userId = false;
} else {
$userId = User::checkLogged();
$user = User::getUserById($userId);
$userName = $user['name'];
$userEmail = $user['email'];
}
}
}
require_once(ROOT . '/views/cart/checkout.php');
return true;
}
}
?><?php
class CatalogController
{
public function actionCatalog()
{
$categories = array();
$categories = Category::getCategoriesList();
$latestProducts = array();
$latestProducts = Product::getCatalogProduct(20);
require_once(ROOT . '/views/catalog/catalog.php');
return true;
}
public function actionCategory($categoryId)
{
$categories = array();
$categories = Category::getCategoriesList();
$categoryProducts = array();
$categoryProducts = Product::getProductsListByCategory($categoryId);
require_once(ROOT . '/views/catalog/category.php');
return true;
}
}
?><?php
class ProductController
{
public function actionGame($id)
{
$categories = array();
$categories = Category::getCategoriesList();
$product = Product::getProductById($id);
require_once(ROOT . '/views/product/game.php');
return true;
}
}
?><?php
class SiteController
{
public function actionMain()
{
$categories = array();
$categories = Category::getCategoriesList();
$latestProducts = array();
$latestProducts = Product::getLatestProduct(10);
require_once(ROOT . '/views/site/main.php');
return true;
}
}
?><?php
class UserController
{
public function actionRegister()
{
$email = '';
$name = '';
$password = '';
if (isset($_POST['submit'])) {
$email = $_POST['email'];
$name = $_POST['name'];
$password = $_POST['password'];
$errors = false;
if (User::checkEmail($email)) {
} else {
$errors[] = 'Неправильный email';
}
if (User::checkName($name)) {
} else {
$errors[] = 'Имя не должно быть короче 2-х символов';
}
if (User::checkPassword($password)) {
} else {
$errors[] = 'Пароль не должен быть короче 6-ти символов';
}
if (User::checkEmailExist($email)) {
$errors[] = 'Такой email ужеиспользуется';
}
if ($errors == false) {
//SAVE USER
$result = User::register($email, $name, $password);
header("Location: /login");
}
}
require_once(ROOT . '/views/user/register.php');
return true;
}
public function actionLogin()
{
$email = '';
$password = '';
if (isset($_POST['submit'])) {
$email = $_POST['email'];
$password = $_POST['password'];
$errors = false;
if (User::checkEmail($email)) {
} else {
$errors[] = 'Неправильный email';
}
if (User::checkPassword($password)) {
} else {
$errors[] = 'Пароль не должен быть короче 6-ти символов';
}
$userId = User::checkUserData($email, $password);
if ($userId == false) {
// Если данные неправильные показываем ошибку
$errors[] = 'Неправильные данные для входа на сайт';
} else {
// Если данные правильные : запоминаем пользователя (сессия)
User::auth($userId);
// Перенаправляем пользователя в закрытую часть - кабинет
header("Location: /cabinet");
}
}
require_once(ROOT . '/views/user/login.php');
return true;
}
public function actionLogout()
{
unset($_SESSION['user']);
Cart::clear();
header("Location: /");
}
}
ЛистингА.5 – Папка models
?><?php
class Cart
{
public static function AddProduct($id)
{
$id = intval($id);
//Пустой массив для товаров в корзине
$productsInCart = array();
//Если в корзине уже есть товары (они хранятся в сессии)
if (isset($_SESSION['products'])) {
//Тогда заполним наш массив товарами
$productsInCart = $_SESSION['products'];
}
//Если товар есть в корзине, но был добавлен ещё раз - увеличение количества
if (array_key_exists($id, $productsInCart)) {
$productsInCart[$id]++;
} else {
//Добавление нового товара в корзину
$productsInCart[$id] = 1;
}
$_SESSION['products'] = $productsInCart;
return self::countItems();
}
public static function deleteProduct($id)
{
//Получение массива с идентификаторами и количеством товаров в корзине
$productsInCart = self::getProducts();
//Удаление из массива элемента с указанным id
unset($productsInCart[$id]);
//Запись массива товаров с удаленным элементов в сессию
$_SESSION['products'] = $productsInCart;
}
/**
* Подсчёт количества товаров в корзине (в сессии)
*/
public static function countItems()
{
if (isset($_SESSION['products'])) {
$count = 0;
foreach ($_SESSION['products'] as $id => $quantity) {
$count = $count + $quantity;
}
return $count;
} else {
return 0;
}
}
public static function getProducts()
{
if (isset($_SESSION['products'])) {
return $_SESSION['products'];
}
return false;
}
public static function getTotalPrice($products)
{
$productsInCart = self::getProducts();
$total = 0;
if ($productsInCart) {
foreach ($products as $item) {
$total += $item['price'] * $productsInCart[$item['id']];
}
}
return $total;
}
public static function clear()
{
if (isset($_SESSION['products'])) {
unset($_SESSION['products']);
}
}
}
?><?php
class Category
{
public static function getCategoriesList()
{
$db = Db::getConnection();
$categoryList = array();
$result = $db->query('SELECT id, img, name FROM category ' . 'ORDER BY sort_order');
$i = 0;
while ($row = $result->fetch()) {
$categoryList[$i]['id'] = $row['id'];
$categoryList[$i]['img'] = $row['img'];
$categoryList[$i]['name'] = $row['name'];
$i++;
}
return $categoryList;
}
}
?><?php
class Product
{
const SHOW_BY_DEFAULT = 10;
public static function getLatestProduct($count = self::SHOW_BY_DEFAULT)
{
$count = intval($count);
$db = Db::getConnection();
$productsList = array();
$result = $db->query('SELECT id, name, link, price, image, is_new FROM product '
. 'WHERE status = "1" AND is_new = "1"'
. 'ORDER BY id DESC '
. 'LIMIT ' . $count);
$i = 0;
while ($row = $result->fetch()) {
$productsList[$i]['id'] = $row['id'];
$productsList[$i]['name'] = $row['name'];
$productsList[$i]['link'] = $row['link'];
$productsList[$i]['image'] = $row['image'];
$productsList[$i]['price'] = $row['price'];
$productsList[$i]['is_new'] = $row['is_new'];
$i++;
}
return $productsList;
}
public static function getCatalogProduct($count = self::SHOW_BY_DEFAULT)
{
$count = intval($count);
$db = Db::getConnection();
$productsList = array();
$result = $db->query('SELECT id, name, link, price, image, is_new FROM product '
. 'WHERE status = "1"'
. 'ORDER BY id DESC '
. 'LIMIT ' . $count);
$i = 0;
while ($row = $result->fetch()) {
$productsList[$i]['id'] = $row['id'];
$productsList[$i]['name'] = $row['name'];
$productsList[$i]['link'] = $row['link'];
$productsList[$i]['image'] = $row['image'];
$productsList[$i]['price'] = $row['price'];
$productsList[$i]['is_new'] = $row['is_new'];
$i++;
}
return $productsList;
}
public static function getProductsListByCategory($categoryId = false)
{
if ($categoryId) {
$db = Db::getConnection();
$products = array();
$result = $db->query("SELECT id, name, link, price, image FROM product "
. "WHERE status = '1' AND category_id = '$categoryId'"
. "ORDER BY id DESC "
. "LIMIT " . self::SHOW_BY_DEFAULT);
$i = 0;
while ($row = $result->fetch()) {
$products[$i]['id'] = $row['id'];
$products[$i]['name'] = $row['name'];
$products[$i]['link'] = $row['link'];
$products[$i]['image'] = $row['image'];
$products[$i]['price'] = $row['price'];
$i++;
}
return $products;
}
}
public static function getProductById($id)
{
$id = intval($id);
if ($id) {
$db = Db::getConnection();
$result = $db->query("SELECT * FROM product WHERE id = '$id'");
$result->setFetchMode(PDO::FETCH_ASSOC);
return $result->fetch();
}
}
public static function getProductsByIds($idsArray)
{
$products = array();
$db = Db::getConnection();
$idsString = implode(',', $idsArray);
$sql = "SELECT * FROM product WHERE status ='1' AND id IN ($idsString)";
$result = $db->query($sql);
$result->setFetchMode(PDO::FETCH_ASSOC);
$i = 0;
while ($row = $result->fetch()) {
$products[$i]['id'] = $row['id'];
$products[$i]['name'] = $row['name'];
$products[$i]['image'] = $row['image'];
$products[$i]['price'] = $row['price'];
$i++;
}
return $products;
}
}
?><?php
class Sales
{
public static function save($userName, $userEmail, $userPurse, $userId, $products)
{
// Соединение с БД
$db = Db::getConnection();
// ТекстзапросакБД
$sql = 'INSERT INTO sales (user_name, user_email, user_purse, user_id, products) '
. 'VALUES (:user_name, :user_email, :user_purse, :user_id, :products)';
$products = json_encode($products);
$result = $db->prepare($sql);
$result->bindParam(':user_name', $userName, PDO::PARAM_STR);
$result->bindParam(':user_email', $userEmail, PDO::PARAM_STR);
$result->bindParam(':user_purse', $userPurse, PDO::PARAM_STR);
$result->bindParam(':user_id', $userId, PDO::PARAM_STR);
$result->bindParam(':products', $products, PDO::PARAM_STR);
return $result->execute();
}
}
?>
<?php
class User
{
public static function register($email, $name, $password)
{
$db = Db::getConnection();
$sql = 'INSERT INTO users (email , name , password)' . 'VALUES (:email, :name, :password)';
$result = $db->prepare($sql);
$result->bindParam(':email', $email, PDO::PARAM_STR);
$result->bindParam(':name', $name, PDO::PARAM_STR);
$result->bindParam(':password', $password, PDO::PARAM_STR);
return $result->execute();
}
public static function checkUserData($email, $password)
{
$db = Db::getConnection();
$sql = 'SELECT * FROM users WHERE email = :email AND password = :password';
$result = $db->prepare($sql);
$result->bindParam(':email', $email, PDO::PARAM_INT);
$result->bindParam(':password', $password, PDO::PARAM_INT);
$result->execute();
$user = $result->fetch();
if ($user) {
return $user['id'];
}
return false;
}
public static function auth($userId)
{
$_SESSION['user'] = $userId;
}
public static function checkLogged()
{
if (isset($_SESSION['user'])) {
return $_SESSION['user'];
}
header("Location: /login");
}
public static function isGuest()
{
if (isset($_SESSION['user'])) {
return false;
} else {
return true;
}
}
public static function checkEmail($email)
{
if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
return true;
}
return false;
}
public static function checkName($name)
{
if (strlen($name) >= 2) {
return true;
}
return false;
}
public static function checkPassword($password)
{
if (strlen($password) >= 6) {
return true;
}
return false;
}
public static function checkEmailExist($email)
{
$db = Db::getConnection();
$sql = 'SELECT COUNT(*) FROM users WHERE email = :email';
$result = $db->prepare($sql);
$result->bindParam(':email', $email, PDO::PARAM_STR);
$result->execute();
if ($result->fetchColumn())
return true;
return false;
}
public static function getUserById($id)
{
if ($id) {
$db = Db::getConnection();
$sql = 'SELECT * FROM users WHERE id = :id';
$result = $db->prepare($sql);
$result->bindParam(':id', $id, PDO::PARAM_INT);
$result->setFetchMode(PDO::FETCH_ASSOC);
$result->execute();
return $result->fetch();
}
}
public static function edit($id, $email, $name, $password)
{
$db = Db::getConnection();
$sql = "UPDATE users
SET email = :email,name = :name , password = :password
WHERE id = :id";



$result = $db->prepare($sql);
$result->bindParam(':id', $id, PDO::PARAM_INT);
$result->bindParam(':email', $email, PDO::PARAM_INT);
$result->bindParam(':name', $name, PDO::PARAM_INT);
$result->bindParam(':password', $password, PDO::PARAM_INT);
return $result->execute();
}
}

