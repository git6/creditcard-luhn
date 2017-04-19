/**
 * Created by git6 on 2017/04/13.
 */

function checkCardNumber(select_target, select_success, select_error) {
    var target_elm = document.querySelector(select_target);
    var success_elm = document.querySelector(select_success);
    var error_elm = document.querySelector(select_error);

    console.log("ELEM:", target_elm, success_elm, error_elm);

    success_elm.innerHTML = '';
    error_elm.innerHTML = '';

    var num_count = target_elm.value.length;
    var num_split = target_elm.value.split("");
    var num_split_r = num_split.concat();
    num_split_r.reverse();

    console.log("SPRIT:", num_split);
    console.log("SPRIT_R:", num_split_r);

    var digits_1 = Number(num_split[0]);
    var digits_2 = Number(num_split[0] + num_split[1]);
    var digits_3 = Number(num_split[0] + num_split[1] + num_split[2]);
    var digits_4 = Number(num_split[0] + num_split[1] + num_split[2] + num_split[3]);
    var digits_5 = Number(num_split[0] + num_split[1] + num_split[2] + num_split[3] + num_split[4]);
    var digits_6 = Number(num_split[0] + num_split[1] + num_split[2] + num_split[3] + num_split[4] + num_split[5]);
    var luhn_total_value = 0;

    if (num_count < 13) {
        error_elm.innerHTML = 'カード番号の桁が不足しています';
        return;
    } else if (num_count > 16) {
        error_elm.innerHTML = 'カード番号は14〜16桁で入力してください。';
        return;
    }

    console.log("DIGITS_COUNT:", num_count);
    console.log(digits_1, digits_2, digits_3, digits_4, digits_5, digits_6);

    // Luhn 計算
    num_split_r.forEach(function (val, i) {
        var true_index = i + 1;
        if (true_index % 2 === 0) {
            // 偶数の場合は2倍処理を実行
            var luhn_odd_temp_num = Number(val) * 2;
            var luhn_odd_temp_str = (Number(val) * 2) + "";
            console.log("No.", true_index, "[偶数]", luhn_odd_temp_num);
            if (luhn_odd_temp_num >= 10) {
                // 2倍処理の結果2桁以上になったら分割
                var luhn_odd_temp_split = luhn_odd_temp_str.split("");
                // 分割後の数値を各加算
                luhn_odd_temp_split.forEach(function (val, i) {
                    luhn_total_value = luhn_total_value + Number(val);
                    console.log("   + ", val);
                });
            } else {
                luhn_total_value = luhn_total_value + luhn_odd_temp_num;
            }
        } else {
            console.log("No.", true_index, "[奇数]", Number(val));
            luhn_total_value = luhn_total_value + Number(val);
        }
    });

    console.log("LUHNTOTAL:", luhn_total_value);
    console.log("RES_LAST: 0 =", luhn_total_value % 10);


    // =========================================== //
    // Luhnアルゴリズムを採用していないカードブランド
    if (digits_1 === 1 && num_count === 15) {
        // UATP
        success_elm.innerHTML = 'カード番号は14〜16桁で入力してください。';
        return;
    } else if (digits_3 >= 624 && digits_3 <= 626 && num_count === 16) {
        //　Union Pay
        success_elm.innerHTML = '番号はアルゴリズムと一致しました。カードブランドは[Union Pay type.2]です';
        return;
    } else if (digits_4 >= 6282 && digits_4 <= 6288 && num_count === 16) {
        success_elm.innerHTML = '番号はアルゴリズムと一致しました。カードブランドは[Union Pay type.3]です';
        return;
    } else if (digits_6 >= 622126 && digits_6 <= 622925 && num_count === 16) {
        success_elm.innerHTML = '番号はアルゴリズムと一致しました。カードブランドは[Union Pay type.3]です';
        return;
    }
    // =========================================== //

    if (luhn_total_value % 10 === 0) {
        // Luhn 整合のカード番号の処理
        switch (num_count) {
            case 13:
                // Old Visa
                error_elm.innerHTML = 'カード番号の桁が不足しています';
                break;
            // =========================================== //
            case 14:
                // Diners Club
                if (digits_1 === 5) {
                    success_elm.innerHTML = '番号はアルゴリズムと一致しました。カードブランドは[Diners Club type.1]です';
                } else if (digits_4 === 3095) {
                    success_elm.innerHTML = '番号はアルゴリズムと一致しました。カードブランドは[Diners Club type.2です';
                } else if (digits_2 === 36 || digits_2 === 38 || digits_2 === 39) {
                    success_elm.innerHTML = '番号はアルゴリズムと一致しました。カードブランドは[Diners Club type.3]です';
                } else if (digits_6 >= 300000 && digits_6 <= 303574) {
                    success_elm.innerHTML = '番号はアルゴリズムと一致しました。カードブランドは[Diners Club type.4]です';
                } else {
                    success_elm.innerHTML = 'このカードは判別出来ませんでしたが、恐らく[Diners Club]です。';
                    console.log("BRAND:Unknown[" + digits_6 + "...]");
                }
                break;
            // =========================================== //
            case 15:
                // AMEX
                if (digits_1 === 1) {
                    error_elm.innerHTML = '不明なカード番号です';
                    console.log("BRAND:Unknown[" + digits_6 + "...]");
                } else if (digits_2 === 34 || digits_2 === 37) {
                    success_elm.innerHTML = '番号はアルゴリズムと一致しました。カードブランドは[American Express]です';
                } else {
                    error_elm.innerHTML = '不明なカード番号です';
                    console.log("BRAND:Unknown[" + digits_6 + "...]");
                }
                break;
            // =========================================== //
            case 16:
                // Visa Master JCB Discover UnionPay

                if (digits_1 === 4) {
                    success_elm.innerHTML = '番号はアルゴリズムと一致しました。カードブランドは[Visa]です';

                } else if (digits_4 >= 3528 && digits_4 <= 3589) {
                    success_elm.innerHTML = '番号はアルゴリズムと一致しました。カードブランドは[JCB]です';

                } else if (digits_6 >= 222100 && digits_6 <= 272099) {
                    success_elm.innerHTML = '番号はアルゴリズムと一致しました。カードブランドは[Master Card type.1]です';

                } else if (digits_1 === 5) {
                    success_elm.innerHTML = '番号はアルゴリズムと一致しました。カードブランドは[Master Card type.2]です';

                } else if (digits_5 === 60100 || digits_5 === 60112 || digits_5 === 60113 || digits_5 === 60114) {
                    //　Discover
                    success_elm.innerHTML = '番号はアルゴリズムと一致しました。カードブランドは[Discover Card type.1]です';
                } else if (digits_6 >= 601174 && digits_6 <= 601179) {
                    success_elm.innerHTML = '番号はアルゴリズムと一致しました。カードブランドは[Discover Card type.2]です';
                } else if (digits_6 >= 601186 && digits_6 <= 601199) {
                    success_elm.innerHTML = '番号はアルゴリズムと一致しました。カードブランドは[Discover Card type.3]です';
                } else if (digits_3 >= 644 && digits_3 <= 649) {
                    success_elm.innerHTML = '番号はアルゴリズムと一致しました。カードブランドは[Discover Card type.4]です';
                } else if (digits_2 === 65) {
                    success_elm.innerHTML = '番号はアルゴリズムと一致しました。カードブランドは[Discover Card type.5]です';

                } else {
                    console.log("BRAND:Unknown[" + digits_6 + "...]");
                }
                break;
            // =========================================== //
            default:
                console.log("BRAND:Unknown[" + digits_6 + "...]");
                break;
        }
    } else {
        // Luhn 不整合
        error_elm.innerHTML = '不正なカード番号です';
    }
}
