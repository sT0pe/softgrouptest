<p class="justify"><h1>Завдання 3</h1>
    Вводяться N натуральних чисел більше 2. Підрахувати, скільки серед них простих чисел.
</p>
<hr/>

<form action="" method="post">
    <label>Введіть числа:</label><br/>
    <textarea cols="120" rows="5" name="numbers"><?php echo $text; ?></textarea><br/><br/>
    <input type="submit" value="Підрахувати прості числа"/><br/><br/>
    <input type="hidden" name="ex" value="<?php echo $content; ?>">
</form>

<div>
    <?php
    if ($result == 0) {
        echo 'Числа відсутні!';
    } else {
        echo 'Кількість простих чисел: ' . $result;
    }
    ?>
</div>