import 'package:http/http.dart';
import 'dart:convert';
import 'package:soundscape/main.dart';

Future<bool> forgetPassword({required String email})async{
  final url=Uri.parse("http://192.168.45.77:3000/api/users/forgotPassword");
  final response=await post(
    url,
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(<String, String>{
      'email': email,
    }),
  );

  return response.statusCode==200;
}

Future<bool> resetPassword({required String email,required String resetCode,required String newPassword})async{
  final url=Uri.parse("http://192.168.45.77:3000/api/users/resetPassword");
  final response=await post(
    url,
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode(<String, String>{
      'email': email,
      'password':newPassword,
      'resetCode':resetCode
    }),
  );
  if(response.statusCode==200){

    final decodedResponse = jsonDecode(response.body);
    await pref.setString("token", decodedResponse["token"]);
    await pref.setString("userName", decodedResponse["user"]["name"]);
    await pref.setString("email", decodedResponse["user"]["email"]);
    userEmail = decodedResponse["user"]["email"];
    userName = decodedResponse["user"]["name"];
    token = decodedResponse["token"];

    return true;
  }else{
    return false;
  }
}