<p class="justify"><h1>Завдання 2</h1>
    У форму вводиться текст, слова в якому розділені пробілами і розділовими знаками. Вилучити з цього тексту всі слова найбільшої довжини. (Слів найбільшої довжини може бути декілька).
</p>
<hr/>

<form action="" method="post">
    <label>Введіть текст:</label><br/>
    <textarea cols="120" rows="10" name="text"><?php echo $text; ?></textarea><br/><br/>
    <input type="submit" value="Вилучити слова"/><br/><br/>
    <input type="hidden" name="ex" value="<?php echo $content; ?>">
</form>

<div>
    <?php
    if (empty($results[0])) {
        echo 'Слова відсутні!';
    } else {
        echo 'Слова найбільшої довжини: ';
    }
    foreach ($results as $result){
        echo $result,"\n";
    }
    ?>
</div>