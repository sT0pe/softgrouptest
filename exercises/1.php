<p class="justify"><h1>Завдання 1</h1>
    У форму вводиться число N. Знайти всі досконалі числа до N. Досконале число - це таке число, що дорівнює сумі всіх своїх дільників, крім себе самого. Наприклад, число 6 є досконалим, тому що крім себе самого ділиться на числа 1, 2 і 3, які в сумі дають 6.
</p>
<hr/>

<form action="" method="get">
    <label>Введіть число:</label><br/>
    <input type="number" name="numb" value="<?php echo $n; ?>"/><br/><br/>
    <input type="submit" value="Знайти досконалі числа"/><br/><br/>
    <input type="hidden" name="ex" value="<?php echo $content; ?>">
    <div>
        <?php
        if (empty($results)) {
            echo 'Досконалих чисел не знайдено!';
        } else {
            echo 'Досконалі числа: ';
        }
        foreach ($results as $result){
            echo $result,"\n";
        }
        ?>
    </div>
</form>
