<p class="justify"><h1>Завдання 5</h1>
    Задано текст. Словом вважається послідовність непробільних символів, які йдуть підряд. Слова розділені одним або більшим числом пробілів або символами кінця рядка.<br/>
    Для кожного слова з цього тексту підрахуйте, скільки разів воно зустрічалось в цьому тексті раніше. Використайте словники.<br/><br/>
    <strong>Приклад:</strong><br/>
</p>
<table class="border">
    <tr>
        <td><strong>Ввід</strong></td>
        <td><strong>Вивід</strong></td>
    </tr>
    <tr>
        <td>one two one two three</td>
        <td>0 0 1 1 0</td>
    </tr>
    <tr>
        <td>She sells sea shells on the sea shore;<br/>The shells that she sells are sea shells I'm sure.<br/>So if she sells sea shells on the sea shore,<br/> I'm sure that the shells are sea shore shells.</td>
        <td>0 0 0 0 0 0 1 0 0 1 0 0 1 0 2 2 0 0 0 0 1 2 3 3 1 1 4 0 1 0 1 2 4 1 5 0 0</td>
    </tr>
</table>
<hr/>

<form action="" method="post">
    <table>
        <tr>
            <td><label>Ввід:</label></td>
            <td><label>Вивід:</label></td>
        </tr>
        <tr>
            <td><textarea cols="50" rows="10" name="text"><?php echo $text ?></textarea></td>
            <td><textarea cols="50" rows="10" name="result"><?php
                    if($words[0] == '') {
                        echo 'Вхідні дані відсутні!';
                    } else {
                        foreach ($result as $r) {
                            echo $r, '&nbsp;';
                        }
                    }
                    ?></textarea></td>
        </tr>
        <tr>
            <td><input type="submit" value="Підрахувати"/>
            <input type="hidden" name="ex" value="<?php echo $content; ?>"></td>
        </tr>
    </table>
</form>