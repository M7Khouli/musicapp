import 'package:flutter/material.dart';
import 'package:soundscape/services/authentication/signup.dart';
import 'package:soundscape/widget/bar.dart';
import 'package:soundscape/services/authentication/validator.dart';

class Signup extends StatelessWidget {
  const Signup({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      appBar: MyAppBar(appBarType: 2),
      body: const SignupPage(),
    );
  }
}

class SignupPage extends StatefulWidget {
  const SignupPage({super.key});

  @override
  State<SignupPage> createState() => _SignupPageState();
}

class _SignupPageState extends State<SignupPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  String _email = '', _name = '', _password = '', _passwordConfirm = '';
  bool _loading = false;
  final _signupVar = SignupLogic();

  void _signup() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _loading = true);
      bool success = await _signupVar.signup(
          email: _email,
          password: _password,
          name: _name,
          passwordConfirm: _passwordConfirm);
      setState(() => _loading = false);

      if (success) {
        if (mounted) {
          Navigator.pushNamed(context,"/Verification",arguments: {"resetPassword":false,"email":_email});
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Signup failed')),
          );
        }
      }
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
              decoration: const InputDecoration(labelText: 'Name'),
              onChanged: (value) => _name = value,
              validator: (value) =>
                  value!.isEmpty ? 'Please enter your name' : null,
            ),
            TextFormField(
              decoration: const InputDecoration(labelText: 'Email'),
              onChanged: (value) => _email = value,
              validator: emailValidator,
            ),
            TextFormField(
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Password'),
              onChanged: (value) => _password = value,
              validator: passwordValidator,
            ),
            TextFormField(
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Confirm Password'),
              onChanged: (value) => _passwordConfirm = value,
              validator: (value) =>
                  value != _password ? 'Passwords do not match' : null,
            ),
            const SizedBox(height: 20),
            _loading
                ? const CircularProgressIndicator()
                : SizedBox(
                    width: double.infinity,
                    child: TextButton(
                        style: const ButtonStyle(
                          backgroundColor:
                              MaterialStatePropertyAll<Color>(Colors.green),
                        ),
                        onPressed: _signup,
                        child: const Text("signup",
                            style:
                                TextStyle(color: Colors.black, fontSize: 20))),
                  ),
          ],
        ),
      ),
    );
  }
}
