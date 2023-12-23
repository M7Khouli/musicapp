import 'package:http/http.dart';
import 'dart:convert';
import 'package:soundscape/main.dart';

Future<int> login({email, password}) async {
  var url = Uri.parse('http://192.168.45.77:3000/api/users/login');
  final response = await post(
    url,
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(<String, String>{
      'email': email,
      'password': password,
    }),
  );
  print(response.body);
  if (response.statusCode == 200) {
    final decodedResponse = jsonDecode(response.body);
    await pref.setString("token", decodedResponse["token"]);
    await pref.setString("userName", decodedResponse["user"]["name"]);
    await pref.setString("email", decodedResponse["user"]["email"]);
    userEmail = decodedResponse["user"]["email"];
    userName = decodedResponse["user"]["name"];
    token = decodedResponse["token"];
    return 1;
  } else if (response.statusCode == 401) {
    return 2;
  } else {
    return 0;
  }
}
