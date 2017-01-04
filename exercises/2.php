<p class="justify"><h1>Завдання 2</h1>
    У форму вводиться текст, слова в якому розділені пробілами і розділовими знаками. Вилучити з цього тексту всі слова найбільшої довжини. (Слів найбільшої довжини може бути декілька).
</p>
<hr/>

<form action="" method="post">
    <table>
    <tr>
        <td><label>Ввід:</label></td>
        <td><label>Вивід:</label></td>
    </tr>
    <tr>
        <td><textarea cols="50" rows="10" name="text"><?php echo $text; ?></textarea></td>
        <td><textarea cols="50" rows="10" name="result"><?php echo $new_text ?></textarea></td>
    </tr>
    <tr><td><input type="submit" value="Вилучити слова"/>
    <input type="hidden" name="ex" value="<?php echo $content; ?>"></td>
    </tr>
    </table>
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
