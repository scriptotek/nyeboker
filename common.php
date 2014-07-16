<?php

error_reporting(E_ALL);
ini_set('display_errors', '1');

function genchksum13($i){                     // function c, $i is the input

    for($a=$s=0;$a<12;)             // for loop x12 - both $a and $s equal 0
                                    // notice there is no incrementation and
                                    // no curly braces as there is just one
                                    // command to loop through

        $s+=$i[$a]*($a++%2?3:1);    // $s (sum) is being incremented by
                                    // $ath character of $i (auto-casted to
                                    // int) multiplied by 3 or 1, depending
                                    // wheter $a is even or not (%2 results
                                    // either 1 or 0, but 0 == FALSE)
                                    // $a is incremented here, using the
                                    // post-incrementation - which means that
                                    // it is incremented, but AFTER the value
                                    // is returned

    return$i.(10-$s%10)%10;         // returns $i with the check digit
                                    // attached - first it is %'d by 10,
                                    // then the result is subtracted from
                                    // 10 and finally %'d by 10 again (which
                                    // effectively just replaces 10 with 0)
                                    // % has higher priority than -, so there
                                    // are no parentheses around $s%10
}

function isbn10_to_13($isbn) {
    $isbn = trim($isbn);
    if(strlen($isbn) == 12){ // if number is UPC just add zero
        $isbn13 = '0'.$isbn;
    } else {
        $isbn2 = substr("978" . trim($isbn), 0, -1);
        $isbn13 = genchksum13($isbn2);
    }
    return ($isbn13);
}


function isbn13_to_10($isbn) {
    if (preg_match('/^\d{3}(\d{9})\d$/', $isbn, $m)) {
        $sequence = $m[1];
        $sum = 0;
        $mul = 10;
        for ($i = 0; $i < 9; $i++) {
            $sum = $sum + ($mul * (int) $sequence{$i});
            $mul--;
        }
        $mod = 11 - ($sum%11);
        if ($mod == 10) {
            $mod = "X";
        }
        else if ($mod == 11) {
            $mod = 0;
        }
        $isbn = $sequence.$mod;
    }
    return $isbn;
}

function two_way_isbn_converter($id){

	if (!is_isbn($id)) return false;

	$isbn = preg_replace('/[^0-9X]/', '', strtoupper($id));
	
	if (strlen($isbn)==13) return isbn13_to_10($isbn);
	if (strlen($isbn)==10) return isbn10_to_13($isbn);

}


function properUrl($url,$method){

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HEADER, true);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($ch, CURLOPT_MAXREDIRS, 10); //follow up to 10 redirections - avoids loops
	$data = curl_exec($ch);
	$info = curl_getinfo($ch);
	$http_code = $info["http_code"];

	// Get final redirected URL, will be the same if URL is not redirected
	$new_url = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL); 
	curl_close($ch);
	// Array of HTTP status codes. Trim down if you would like to.
	$codes = array(0=>'Domain Not Found',
				   100=>'Continue',
				   101=>'Switching Protocols',
				   200=>'OK',
				   201=>'Created',
				   202=>'Accepted',
				   203=>'Non-Authoritative Information',
				   204=>'No Content',
				   205=>'Reset Content',
				   206=>'Partial Content',
				   300=>'Multiple Choices',
				   301=>'Moved Permanently',
				   302=>'Found',
				   303=>'See Other',
				   304=>'Not Modified',
				   305=>'Use Proxy',
				   307=>'Temporary Redirect',
				   400=>'Bad Request',
				   401=>'Unauthorized',
				   402=>'Payment Required',
				   403=>'Forbidden',
				   404=>'Not Found',
				   405=>'Method Not Allowed',
				   406=>'Not Acceptable',
				   407=>'Proxy Authentication Required',
				   408=>'Request Timeout',
				   409=>'Conflict',
				   410=>'Gone',
				   411=>'Length Required',
				   412=>'Precondition Failed',
				   413=>'Request Entity Too Large',
				   414=>'Request-URI Too Long',
				   415=>'Unsupported Media Type',
				   416=>'Requested Range Not Satisfiable',
				   417=>'Expectation Failed',
				   500=>'Internal Server Error',
				   501=>'Not Implemented',
				   502=>'Bad Gateway',
				   503=>'Service Unavailable',
				   504=>'Gateway Timeout',
				   505=>'HTTP Version Not Supported'
	);

	if ($url!= $new_url) {
		$url=$new_url;
	}


	//Returnerer både url og http-kode som json-objekt
	if ($method=="json") {
		
		$output_array["http_code"][$http_code] = $codes[$http_code];
		$output_array["url"]=$url;
		return json_encode($output_array,JSON_FORCE_OBJECT);
	}
	//returnerer bare statuskode i tall
	elseif ($method=="status") {
		return trim($http_code);

	}
	//Viser bare url som tekststreng ved vellykket verifisering av url, da må $method være noe annet enn 'json'
	elseif ($http_code=="200") {
		return trim($url);
	}
}

function file_get_contents2($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_USERAGENT, 'UBO Scriptotek Dalek (+labs.biblionaut.net)');
    curl_setopt($ch, CURLOPT_HEADER, 0); // no headers in the output
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // return instead of output
    $data = curl_exec($ch);
    curl_close($ch);
    return $data;
}

function is_isbn($id) {
    // både dokid og objektid har lengde 9
    // todo: more sophisticated check
    $stripped = preg_replace('/[^0-9X]/', '', strtoupper($id));
    if (strlen($stripped) == '13' || strlen($stripped) == '10') {
        return true;
    }
    return false;
}

function return_json($obj) {
    if (isset($_REQUEST['callback'])) {
        header('Content-type: application/javascript; charset=utf-8');
        echo $_REQUEST['callback'] . '(' . json_encode($obj) . ')';
        exit();
    } else {
        header('Access-Control-Allow-Origin: *');
        header('Content-type: application/json; charset=utf-8');
        if (version_compare(PHP_VERSION, '5.4.0') >= 0) {
            echo json_encode($obj, JSON_PRETTY_PRINT);
        } else {
            echo json_encode($obj);
        }
        exit();
    }
}

function lookup_id($id) {

    //$url = 'http://adminwebservices.bibsys.no/objectIdService/getObjectId?id=' . $id;
    $url = 'http://adminwebservices.bibsys.no/objectIdService/getIds?id=' . $id;

    $ids = trim(file_get_contents2($url));

    $json = array();
    $keys = array(
        'objektId' => 'objektid',
        'dokumentId' => 'dokid',
        'hefteId' => 'heftid',
    );
    foreach (explode("\n", $ids) as $line) {
        list($key, $val) = explode(':', $line);
        $json[$keys[$key]] = trim($val);
    }

    return $json;
}

function uio_ip() {
    $ip  = ip2long($_SERVER['REMOTE_ADDR']);
    // https://www.uio.no/english/services/it/security/cert/about-cert/constituency.html
    if ($ip >= ip2long('193.157.108.0') && $ip <= ip2long('193.157.255.255')) return true;
    if ($ip >= ip2long('129.240.0.0') && $ip <= ip2long('129.240.255.255')) return true;
    if ($ip >= ip2long('158.36.184.0') && $ip <= ip2long('158.36.191.255')) return true;
    if ($ip >= ip2long('193.156.90.0') && $ip <= ip2long('193.156.90.255')) return true;
    if ($ip >= ip2long('193.156.120.0') && $ip <= ip2long('193.156.120.255')) return true;
    return false;
}

function uio_or_local_ip() {
    $ip  = ip2long($_SERVER['REMOTE_ADDR']);
    if (uio_ip()) return true;
    if ($ip == ip2long('192.165.67.230') || $ip == ip2long('212.71.253.164') || $ip == ip2long('127.0.0.1')) return true;
    return false;
}

$config = json_decode(file_get_contents(__DIR__ . '/../config.json'), true);


/*function handleCorsPreflight($allowGet = true, $allowPost = false) {
    // respond to preflights
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        // return only the headers and not the content
        // only allow CORS if we're doing a GET
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {

            if ($allowGet && $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] == 'GET') {
                header('Access-Control-Allow-Origin: *');
                header('Access-Control-Allow-Headers: X-Requested-With');
            }
            if ($allowPost && $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] == 'POST') {
                header('Access-Control-Allow-Origin: *');
                header('Access-Control-Allow-Headers: X-Requested-With');
            }
        }
        exit;
    }
}
*/
