var $_$c = $_$wp(1);
const $_$wvd1 = $_$w(1, 0, $_$c), longestCommonPrefixReduce = words => {
        var $_$c = $_$wf(1);
        if ($_$w(1, 1, $_$c), words[0] === undefined) {
            $_$w(1, 2, $_$c), $_$tracer.log('in here', '', 1, 2);
            return $_$w(1, 3, $_$c), '';
        }
        return $_$w(1, 4, $_$c), words.reduce((comPre, word) => {
            var $_$c = $_$wf(1);
            let temp = ($_$w(1, 5, $_$c), '');
            for (let i = 0; $_$w(1, 6, $_$c), i < comPre.length; i += 1) {
                if ($_$w(1, 7, $_$c), word[i] === comPre[i]) {
                    $_$w(1, 8, $_$c), temp += comPre[i];
                }
            }
            return $_$w(1, 9, $_$c), temp;
        });
    };
const $_$wvd11 = $_$w(1, 10, $_$c), longestCommonPrefix = words => {
        var $_$c = $_$wf(1);
        let commonPre = ($_$w(1, 11, $_$c), '');
        for (let i = 0; $_$w(1, 12, $_$c), i < words.length; i += 1) {
            if ($_$w(1, 13, $_$c), i === 0) {
                $_$w(1, 14, $_$c), commonPre = words[i];
                {
                    $_$w(1, 15, $_$c);
                    break;
                }
            }
            let tempString = ($_$w(1, 16, $_$c), '');
            for (let j = 0; $_$w(1, 17, $_$c), j < words[i].length; j += 1) {
                if ($_$w(1, 18, $_$c), !commonPre) {
                    {
                        $_$w(1, 19, $_$c);
                        break;
                    }
                }
                if ($_$w(1, 20, $_$c), commonPre[j] === words[i][j]) {
                    $_$w(1, 21, $_$c), tempString += words[i][j];
                    if ($_$w(1, 22, $_$c), j === words[i].length - 1) {
                        $_$w(1, 23, $_$c), commonPre = tempString;
                        {
                            $_$w(1, 24, $_$c);
                            break;
                        }
                    }
                } else {
                    $_$w(1, 25, $_$c), commonPre = tempString;
                    {
                        $_$w(1, 26, $_$c);
                        break;
                    }
                }
            }
        }
        return $_$w(1, 27, $_$c), commonPre;
    };
$_$w(1, 28, $_$c), module.exports = { longestCommonPrefix };
$_$wpe(1);