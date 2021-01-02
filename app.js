<?php

class DBinformation
{
    public $connect;

    function __construct()
            if ($connect = mysqli_connect($serverName, $dBUsername, $dBPassword, $dBName)) {
            $this->connect = $connect;
            return $this->connect;  //Kontakter database
        } else {
            die("Faied to connect: " . mysqli_connect_error());  //Giver brugeren beseked, hvis der opstår problem med database
        }
        $serverName = "localhost"; //Udfyld variabler her
        $dBUsername = "root";
        $dBPassword = "";
        $dBName = "test";

        if ($connect = mysqli_connect($serverName, $dBUsername, $dBPassword, $dBName)) {
            $this->connect = $connect;
            return $this->connect;  //Kontakter database
        } else {
            die("Faied to connect: " . mysqli_connect_error());  //Giver brugeren beseked, hvis der opstår problem med database
        }
    }
}

class DBConnection
{
    public $content;
    public $timeStart;
    public $timeEnd;
    public $status;


    function __construct($content, $timeStart, $timeEnd, $status)
    {
        $this->content = $content;
        $this->timeStart = $timeStart;
        $this->timeEnd = $timeEnd;
        $this->status = $status;
    }


    //Method: Send Data
    function dataSend($connect)
    {
        $sql = "INSERT INTO test (content, timeStart, timeEnd, status) VALUES (?, ?, ?, ?)";

        //Make statemnt
        $stmt = mysqli_stmt_init($connect);

        mysqli_stmt_prepare($stmt, $sql);

        //Bind params to statement
        mysqli_stmt_bind_param($stmt, "siii", $this->content, $this->timeStart, $this->timeEnd, $this->status);

        //Execute statement
        if (mysqli_stmt_execute($stmt)) {
        } else {
        }
    }

    function getData($connect, $req = null)
    {

        $sql = "SELECT * FROM test WHERE id=" . $req;
        $res = mysqli_query($connect, $sql);
        if ($res) {
            $tempArray = array();
            while ($row = mysqli_fetch_assoc($res)) {
                $tempPackage = new DATAPACKAGE();
                $tempPackage->set_var($row["id"], $row["content"], $row["timeStart"], $row["timeEnd"], $row["status"]);
                array_push($tempArray, $tempPackage);
            }

            echo (json_encode($tempArray));
        } else {
            echo ("No good");
        }
    }
}

class DATAPACKAGE
{
    public $id;
    public $content;
    public $timeStart;
    public $timeEnd;
    public $status;


    function set_var($id, $content, $timeStart, $timeEnd, $status)
    {
        $this->id = $id;
        $this->content = $content;
        $this->timeStart = $timeStart;
        $this->timeEnd = $timeEnd;
        $this->status = $status;
    }
}

header("Content-Type: application/json");

$DB = new DBinformation();
$connect = $DB->connect;

if ($_POST) {
    $checkedVals = checkData();
    $fromUser = new DBConnection($checkedVals[0], $checkedVals[1], $checkedVals[2], $checkedVals[3]);
    $fromUser->dataSend($connect);
    $fromUser->getData($connect);
} elseif ($_GET) {
    $toUser = new DBConnection(NULL, NULL, NULL, NULL, NULL);
    if ($_GET["id"]) {
        $toUser->getData($connect, $_GET["id"]);
    } else {
        $toUser->getData($connect);
    }
}

function checkData()
{
    $content = $_POST["content"];
    $timeStart = $_POST["timeStart"];
    $timeEnd = $_POST["timeEnd"];
    $status = $_POST["status"];

    return array($content, $timeStart, $timeEnd, $status);
}
