import 'package:flutter/material.dart';
import 'package:ts_portfolio/utility.dart';

class SectIntro extends StatefulWidget {
  SectIntro({Key key}) : super(key: key);

  @override
  _SectIntroState createState() => _SectIntroState();
}

class _SectIntroState extends State<SectIntro> {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: Utility.screenHeight(context),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Container(
            child: Center(
              child: Text(
                "Hello, I'm Terence Sim.",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 70,
                ),
              ),
            ),
          ),
          Container(
            padding: EdgeInsets.all(10),
            child: Center(
              child: Text(
                "Human ?",
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontWeight: FontWeight.w500,
                  fontSize: 50,
                ),
              ),
            ),
          ),
          Container(
            padding: EdgeInsets.all(20),
            child: Row(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                _buildContact(
                  "https://github.com/InTheAxis",
                  Icons.favorite,
                  const Color(0xffffe74c),
                ),
                _buildContact(
                  "https://github.com/InTheAxis",
                  Icons.favorite,
                  const Color(0xffff5964),
                ),
                _buildContact(
                  "https://github.com/InTheAxis",
                  Icons.favorite,
                  const Color(0xff6bf178),
                ),
                _buildContact(
                  "https://github.com/InTheAxis",
                  Icons.favorite,
                  Color(0xff35a7ff),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContact(final String url, IconData icon, final Color color) {
    return Padding(
      padding: EdgeInsets.only(
        left: 5,
        right: 5,
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(100),
        onTap: () => Utility.launchURL(url),
        child: Padding(
          padding: EdgeInsets.all(10),
          child: Icon(
            icon,
            color: color,
            size: 50,
          ),
        ),
      ),
    );
  }
}
