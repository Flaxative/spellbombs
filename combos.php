<?
function sampling($chars, $size, $combinations = array()) {

    # if it's the first iteration, the first set 
    # of combinations is the same as the set of characters
    if (empty($combinations)) {
        $combinations = $chars;
    }

    # we're done if we're at size 1
    if ($size == 1) {
        return $combinations;
    }

    # initialise array to put new values in
    $new_combinations = array();

    # loop through existing combinations and character set to create strings
    foreach ($combinations as $combination) {
        foreach ($chars as $char) {
            $new_combinations[] = $combination . $char;
        }
    }

    # call same function again for the next iteration
    return sampling($chars, $size - 1, $new_combinations);

}

// example
$chars = array('C', 'M', 'R', 'A', 'N', 'T');

foreach($chars as $k => $v) {
  echo "$v<br />";
  }

$output = sampling($chars, 2);
foreach($output as $k => $v) {
  $string = $v;
  $stringParts = str_split($string);
  sort($stringParts);
  $string = implode('', $stringParts);
  $output[$k] = $string;
  }
$output = array_unique($output);
sort($output);
//var_dump($output);

foreach($output as $k => $v) {
  echo "$v<br />";
  }

//echo '<br /><br />';

$output1 = sampling($chars, 3);
foreach($output1 as $k => $v) {
  $string = $v;
  $stringParts = str_split($string);
  sort($stringParts);
  $string = implode('', $stringParts);
  $output1[$k] = $string;
  }
$output1 = array_unique($output1);
sort($output1);
//var_dump($output1);

foreach($output1 as $k => $v) {
  echo "$v<br />";
  }
  

$output2 = sampling($chars, 4);
foreach($output2 as $k => $v) {
  $string = $v;
  $stringParts = str_split($string);
  sort($stringParts);
  $string = implode('', $stringParts);
  $output2[$k] = $string;
  }
$output2 = array_unique($output2);
sort($output2);
//var_dump($output1);

foreach($output2 as $k => $v) {
  echo "$v<br />";
  }