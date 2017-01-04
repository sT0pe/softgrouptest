<?php
switch ($content) {
    case 'avtor':
        include 'avtor.php';
        break;
    case '1':
        include "exercises/1.php";
        break;
    case '2':
        include "exercises/2.php";
        break;
    case '3':
        include "exercises/3.php";
        break;
    case '4':
        include "exercises/4.php";
        break;
    case '5':
        include "exercises/5.php";
        break;
    case '6':
        include "exercises/6.php";
        break;
    default:
        include 'main.php';
}