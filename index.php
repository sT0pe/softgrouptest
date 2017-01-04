<?php
$content = '';

//Посилання на сторінку автора
if (isset($_GET['avtor'])) {
    $content = 'avtor';
}

/////////////////////////////////////////////////////////////////////
//Завдання 1
/////////////////////////////////////////////////////////////////////
if (isset($_GET['ex']) && ($_GET['ex'] == 1)){
    $content = 1;
    $n = 0;
    $results = array();

    if(isset($_GET['numb']) && ($_GET['numb'] != '')) {
        $n = $_GET['numb'];
    }

    /*
     $k = 2;
     $m = 0;
     $arr = array();
     for ($i=2; $i<=$k; $i++){
         $m = pow(2, $i-1) * (pow(2, $i) - 1);
         if ($m <= $n){
             $arr[] = $m;
             $k++;
         } else {
             break;
         }
     }

     foreach ($arr as $ar){
         $sum = 0;
         for ($i=1; $i<=(int)$ar/2; $i++){
             if (((int)$ar%$i) == 0) {
                 $sum += $i;
             }
         }
         if ($sum == (int)$ar) {
             $results[] = $sum;
         }
     }
     */

    for ($i=2;$i<=30;$i++) {
         $p=(1<<$i)-1;
         $t= true;
         for ($j=2;$j*$j<=$p;$j++) {
             if (($p%$j)==0) {
                 $t=false; break;
             }
         }
         if ($t) {
             $a=$p*(1<<($i-1));
             if ($a <= $n){
                $results[] = $a;
             }
         }
     }
}

/////////////////////////////////////////////////////////////////////
//Завдання 2
/////////////////////////////////////////////////////////////////////
if (isset($_GET['ex']) && ($_GET['ex'] == 2)){
    $content = 2;
    $results = array();

    if(isset($_POST['text']) && $_POST['text']!= ''){
        $text = $_POST['text'];
    } else {
        $text = '';
    }

    $words = preg_split('/[\s\d,.()!?:;-]+/', $text, -1, 1);
    $results[0] = $words[0];

    for ($i=1; $i < count($words); ++$i){
        if (mb_strlen($words[$i], 'utf-8') > mb_strlen($results[0], 'utf-8')) {
            unset($results);
            $results[0] = $words[$i];
        } else if (mb_strlen($words[$i], 'utf-8') == mb_strlen($results[0], 'utf-8')) {
            $results[] = $words[$i];
        }
    }
    
    $new_text = str_replace($results, "", $text);

}


/////////////////////////////////////////////////////////////////////
//Завдання 3
/////////////////////////////////////////////////////////////////////
if (isset($_GET['ex']) && ($_GET['ex'] == 3)){
    $content = 3;
    $result = 0;

    if(isset($_POST['numbers']) && $_POST['numbers']!= ''){
        $text = $_POST['numbers'];
    } else {
        $text = '';
    }

    $numbers = preg_split('/[\D]+/', $text, -1, 1);

    foreach ($numbers as $number){
        $bool = true;
        if ($number == 1){
            $bool = false;
            continue;
        }
        for ($i=2; $i*$i <= $number; $i++){
            if (($number % $i) == 0){
               $bool = false;
            }
        }
        if ($bool == true){
            $result++;
        }
    }
}

/////////////////////////////////////////////////////////////////////
//Завдання 4
/////////////////////////////////////////////////////////////////////
if (isset($_GET['ex']) && ($_GET['ex'] == 4)){
    $content = 4;
    $results = array();

    if(isset($_POST['k']) && $_POST['k']!= ''){
        $k = $_POST['k'];
    } else {
        $k = 0;
    }
    if(isset($_POST['n']) && $_POST['n']!= ''){
        $n = $_POST['n'];
    } else {
        $n = 0;
    }
    if(isset($_POST['rules']) && $_POST['rules']!= ''){
        $rules = $_POST['rules'];
        $rule = preg_split('/[\n]+/', $rules, -1, 1);
    } else {
        $rules = '';
        $rule = array();
    }

    $arr = array();
    for ($i=0; $i <= count($rule) - 1; $i++) {
        $days = preg_split('/[\s]+/', $rule[$i], -1, 1);
        $z = 0;
        $x = 0;
        while ($x <= $n) {
            $x = $days[0] + $z * $days[1];

            if ((($x+1) % 7 != 0) && ($x % 7 != 0) && ($x <= $n)) {
                $arr[$i] .= $x . ' ';
            }
            $z++;
        }
    }

    foreach ($arr as $ar){
        $days = preg_split('/[\s]+/', $ar, -1, 1);
        for ($i=0; $i<count($days); $i++){
            if (!in_array($days[$i],$results)){
                $results[] = $days[$i];
            }
        }
    }
}


/////////////////////////////////////////////////////////////////////
//Завдання 5
/////////////////////////////////////////////////////////////////////
if (isset($_GET['ex']) && ($_GET['ex'] == 5)){
    $content = 5;

    if(isset($_POST['text']) && $_POST['text']!= ''){
        $text = $_POST['text'];
    } else {
        $text = '';
    }

    $words=  preg_split('/\s+/', trim($text));
    $arr = array();
    $z = array();
    $result = array();

    for($i=0; $i<count($words); $i++){
        $res = 0;
        if(in_array($words[$i], $arr)){
            $z = array_count_values($arr);
            $res = $z[$words[$i]];
        }
        $arr[] = $words[$i];
        $result[] = $res;
    }
}


/////////////////////////////////////////////////////////////////////
//Завдання 6
/////////////////////////////////////////////////////////////////////
if (isset($_GET['ex']) && ($_GET['ex'] == 6)){
    $content = 6;
    $results = array();

    if(isset($_POST['text']) && $_POST['text']!= ''){
        $text = $_POST['text'];
    } else {
        $text = '';
    }

    $games = preg_split('/[\n]+/', $text, -1, 1);
    $arr = array();

    for ($i=0; $i<count($games); $i++){
        $arr[$i] = preg_split('/[\s]+/', $games[$i], -1, 1);
        $arr[$i][] = $i;
    }

    function sort_function($first, $second){
        if ($first[0] > $second[0]) { return -1; }

        if ($first[0] < $second[0]) { return 1; }

        if ($first[0] == $second[0]) {
            if ($first[2] == $second[2]){ return 0; }
            return ($first[2] > $second[2]) ? 1 : -1;
        }
    }
    usort($arr, 'sort_function');

    $unic = array();
    foreach ($arr as $ar) {
        if(in_array($ar[1], $unic)){
            continue;
        } else {
            $unic[] = $ar[1];
            $results[] = $ar;
        }
    }

    if(isset($results[2])){
        $result = '1 місце. ' . $results[0][1] . ' (' . $results[0][0] . ')' . PHP_EOL . '2 місце. ' . $results[1][1] .
            ' (' . $results[1][0] . ')' . PHP_EOL . '3 місце. ' . $results[2][1] . ' (' . $results[2][0] . ')';
    } else {
        $result ='Недостатня кількість учасників!';
    }
}

include 'home.php';
