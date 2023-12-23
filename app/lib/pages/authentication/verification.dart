import 'package:flutter/material.dart';
import 'package:soundscape/services/authentication/password_recovery.dart';
import 'package:soundscape/services/authentication/validator.dart';
import 'package:soundscape/widget/bar.dart';
import 'package:soundscape/services/authentication/verification.dart';

class Verification extends StatelessWidget {
  Verification({super.key});

  bool resetPassword = true;
  late String email;

  @override
  Widget build(BuildContext context) {
    var argument = ModalRoute.of(context)?.settings.arguments;
    if (argument is Map) {
      resetPassword = argument["resetPassword"];
      email = argument["email"];
    } else {
      resetPassword = false;
      email = "";
    }
    return Scaffold(
      backgroundColor: Colors.grey[300],
      appBar: MyAppBar(
        appBarType: 2,
      ),
      body: VerificationPage(resetPassword: resetPassword, email: email),
    );
  }
}

class VerificationPage extends StatefulWidget {
  VerificationPage(
      {super.key, required this.resetPassword, required this.email});

  final String email;
  final bool resetPassword;

  @override
  State<VerificationPage> createState() => _VerificationPageState();
}

class _VerificationPageState extends State<VerificationPage> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  String _password = "", _verificationCode = "";
  bool _loading = false;

  void _buttonFun() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _loading = true);
      bool success = widget.resetPassword
          ? await resetPassword(
              email: widget.email,
              resetCode: _verificationCode,
              newPassword: _password)
          : await verify(
              email: widget.email, verificationCode: _verificationCode);
      setState(() => _loading = false);

      if (success) {
        if (mounted) {
          Navigator.popUntil(context, ModalRoute.withName("/Home"));
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text("wrong verification code")));
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
              decoration: const InputDecoration(labelText: 'Verification Code'),
              onChanged: (value) => _verificationCode = value,
              validator: (value) {
                if (value == null || value.length != 5) {
                  return 'the verification code must have 5 digits';
                }
                return null;
              },
            ),
            widget.resetPassword
                ? TextFormField(
                    obscureText: true,
                    decoration:
                        const InputDecoration(labelText: 'New Password'),
                    onChanged: (value) => _password = value,
                    validator: passwordValidator,
                  )
                : const SizedBox(
                    width: 0,
                  ),
            widget.resetPassword
                ? TextFormField(
                    obscureText: true,
                    decoration: const InputDecoration(
                        labelText: 'Confirm New Password'),
                    validator: (value) =>
                        value != _password ? 'Passwords do not match' : null,
                  )
                : const SizedBox(
                    width: 0,
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
                        onPressed: _buttonFun,
                        child: Text(
                            widget.resetPassword ? "change password" : "verify",
                            style: const TextStyle(
                                color: Colors.black, fontSize: 20))),
                  ),
          ],
        ),
      ),
    );
  }
}
