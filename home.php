<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Тестове завдання</title>
    <link href="stylesheet.css" rel="stylesheet">
</head>
<body>
    <?php include 'header.php'; ?>
    <div class="clearfix">
    <div class="col-1">
        <nav id="vertical">
            <ul class="menu">
                <li <?php if ($content == 1){ echo 'style="background-color: lavender;"';} ?>><a href="?ex=1">Завдання 1</a></li>
                <li <?php if ($content == 2){ echo 'style="background-color: lavender;"';} ?>><a href="?ex=2">Завдання 2</a></li>
                <li <?php if ($content == 3){ echo 'style="background-color: lavender;"';} ?>><a href="?ex=3">Завдання 3</a></li>
                <li <?php if ($content == 4){ echo 'style="background-color: lavender;"';} ?>><a href="?ex=4">Завдання 4</a></li>
                <li <?php if ($content == 5){ echo 'style="background-color: lavender;"';} ?>><a href="?ex=5">Завдання 5</a></li>
                <li <?php if ($content == 6){ echo 'style="background-color: lavender;"';} ?>><a href="?ex=6">Завдання 6</a></li>
            </ul>
        </nav>
    </div>

    <div class="col-2">
        <?php include 'content.php'; ?>
    </div>
    </div>
    <?php include 'footer.php'; ?>
</body>
</html>