import 'package:flutter/material.dart';
import 'package:soundscape/services/authentication/login.dart';
import 'package:soundscape/widget/bar.dart';
import 'package:soundscape/services/authentication/validator.dart';
import 'package:soundscape/services/authentication/password_recovery.dart';

class Login extends StatelessWidget {
  const Login({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      appBar: MyAppBar(appBarType: 1),
      body: const LoginPage(),
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  String _email = '', _password = '';
  bool _loading = false, _resetPassword = false;

  void _login() async {
    setState(() => _resetPassword = false);
    if (_formKey.currentState!.validate()) {
      setState(() => _loading = true);
      int success = await login(email: _email, password: _password);
      setState(() => _loading = false);

      if (success == 1) {
        if (mounted) {
          Navigator.popUntil(context, ModalRoute.withName("/Home"));
        }
      } else if (success == 0) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Login failed')),
          );
        }
      } else {
        if (mounted) {
          Navigator.pushNamed(context, "/Verification",
              arguments: {"resetPassword": false, "email": _email});
        }
      }
    }
  }

  void _resetPass()async {
    setState(() => _resetPassword = true);
    if (_formKey.currentState!.validate()) {
      setState(()=>_loading=true);

      bool success=await forgetPassword(email: _email);

      if(success) {
        if (mounted) {
          Navigator.pushNamed(context, "/Verification",
              arguments: {"resetPassword": true, "email": _email});
        }
      }else {
        if(mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text("email not found"))
          );
        }
      }
      setState(()=>_loading=false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextFormField(
              decoration: const InputDecoration(labelText: 'Email'),
              onChanged: (value) => _email = value,
              validator: emailValidator,
            ),
            TextFormField(
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Password'),
              onChanged: (value) => _password = value,
              validator: (value) {
                if (_resetPassword) return null;
                return passwordValidator(value);
              },
            ),
            const SizedBox(height: 40),
            _loading
                ? const CircularProgressIndicator()
                : SizedBox(
                    width: double.infinity,
                    child: TextButton(
                        style: const ButtonStyle(
                          backgroundColor:
                              MaterialStatePropertyAll<Color>(Colors.green),
                        ),
                        onPressed: _login,
                        child: const Text("login",
                            style:
                                TextStyle(color: Colors.black, fontSize: 20))),
                  ),
            _loading
                ? const SizedBox(
                    width: 0,
                  )
                : TextButton(
                    onPressed: _resetPass,
                    style: TextButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      padding: EdgeInsets.zero,
                    ),
                    child: const Text(
                      "forget password",
                      style: TextStyle(color: Colors.green, fontSize: 16),
                    ),
                  )
          ],
        ),
      ),
    );
  }
}
