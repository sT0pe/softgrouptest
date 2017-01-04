<header>
<div class="header clearfix">
    <div class="logo"><a href="<?php echo 'http://'.$_SERVER["HTTP_HOST"] ?>"><img src="http://softgroup.ua/sites/default/files/logo.png" /></a></div>
    <nav id="horizontal">
        <ul class="menu">
            <li <?php if ($content == ''){ echo 'style="background-color: lavender;"';} ?>><a href="<?php echo 'http://'.$_SERVER["HTTP_HOST"] ?>">Головна</a></li>
            <li <?php if ($content == 'avtor'){ echo 'style="background-color: lavender;"';} ?>><a href="?avtor">Автор</a></li>
            <li><a href="http://softgroup.ua" target="_blank">Soft Group</a></li>
        </ul>
    </nav>
    <div class="caption clearfix"><p><span class="name">SoftGroup</span><br/><span class="title">Тестове завдання</span></p></div>
</div>
</header>