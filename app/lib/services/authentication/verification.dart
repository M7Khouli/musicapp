import 'package:http/http.dart';
import 'dart:convert';
import 'package:soundscape/main.dart';

Future<bool> verify(
    {required String email, required String verificationCode}) async {
  try {
    var url = Uri.parse("http://192.168.45.77:3000/api/users/activate");
    final response = await post(
      url,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, String>{
        'email': email,
        'code': verificationCode,
      }),
    );
    if (response.statusCode == 200) {
      final decodedResponse = jsonDecode(response.body);
      await pref.setString("token", decodedResponse["token"]);
      await pref.setString("userName", decodedResponse["user"]["name"]);
      await pref.setString("email", decodedResponse["user"]["email"]);
      userEmail = decodedResponse["user"]["email"];
      userName = decodedResponse["user"]["name"];
      token = decodedResponse["token"];
      return true;
    } else {
      return false;
    }
  } catch (e) {
    print(e);
    return false;
  }
}