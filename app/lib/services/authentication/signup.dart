import 'package:http/http.dart';
import 'dart:convert';
import 'package:soundscape/main.dart';

class SignupLogic {
  Future<bool> signup({email, password, name, passwordConfirm}) async {
    var url = Uri.parse("http://192.168.45.77:3000/api/users/signup");
    var response = await post(url,
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: jsonEncode({
          "name": name,
          "password": password,
          "passwordConfirm": passwordConfirm,
          "email": email
        }));
    if (response.statusCode == 201) {
      return true;
    } else {
      return false;
    }
  }
}
