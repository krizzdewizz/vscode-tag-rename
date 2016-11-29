<?php
$x = 9;
$a = $x * 2;
if ($_GET["view"] === "table") {
?>
<table>
    <?php
    foreach ($result["attributes"] as $name => $value) {
    ?>
    <tr class='attribute'><td class='name'><?=$name?>:</td> <td><?=$value?></td></tr>
    <?php
    }
    ?>
</table>
<?php
}
?>