
String? emailValidator(String? value) {
  if (value == null || value.isEmpty) {
    return 'Email can\'t be empty';
  }

  // Regular expression for the email pattern
  String pattern = r'^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,3}$';
  RegExp regex = RegExp(pattern);


  if (!regex.hasMatch(value)) {
  return 'Enter a valid email';
  }

  return null;
}

String? passwordValidator(String? value) {
  if (value == null || value.isEmpty) {
    return 'Please enter a password';
  }
  if (value.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  bool hasLetters = value.contains(RegExp(r'[A-Za-z]'));
  bool hasDigits = value.contains(RegExp(r'[0-9]'));

  if (!hasLetters || !hasDigits) {
    return 'Password must contain at least one letter and one number';
  }
  return null;
}