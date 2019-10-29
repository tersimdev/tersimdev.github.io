import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:ts_portfolio/page.dart';
import 'package:ts_portfolio/s_intro.dart';
import 'package:ts_portfolio/s_about.dart';
import 'package:ts_portfolio/s_projects.dart';
import 'package:ts_portfolio/s_resume.dart';

//palette : ffe74c, ff5964, ffffff, 6bf178, 35a7ff

void main() {
  debugPaintSizeEnabled = false;
  runApp(Main());
}

class Main extends StatelessWidget {
  // This widget is the root of your application.

  @override
  Widget build(BuildContext context) {
    MyPageView _page = _buildScrollView();

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Terence Sim\'s Portfolio',
      theme: ThemeData(
        backgroundColor: const Color(0xffffffff),
        primarySwatch: Colors.indigo,
        fontFamily: "GoogleSans",
      ),
      home: Scaffold(
        backgroundColor: const Color(0xffffffff),
        appBar: _buildAppBar(_page),
        body: _page,
      ),
    );
  }

  Widget _buildAppBar(MyPageView pageView) {
    return AppBar(
      titleSpacing: 0,
      title: Container(
        child: _helperMenuBtn("_icon", pageView, 0),
      ),
      elevation: 0.0,
      actions: <Widget>[
        _helperMenuBtn("About", pageView, 1),
        _helperMenuBtn("Projects", pageView, 2),
        Padding(
          padding: EdgeInsets.only(right: 15),
          child: _helperMenuBtn("Resume", pageView, 3),
        ),
      ],
    );
  }

  Widget _buildScrollView() {
    return MyPageView(
      children: <Widget>[
        SectIntro(),
        SectAbout(),
        SectProjects(),
        SectResume(),
      ],
    );
  }

  Widget _helperMenuBtn(
      final String text, final MyPageView page, final int pageNum) {
    return Container(
      padding: EdgeInsets.only(top: 10, bottom: 10),
      child: FlatButton(
        onPressed: () => page.scrollTo(pageNum),
        child: text != "_icon"
            ? Text(
                text,
                textScaleFactor: 1.1,
              )
            : Icon(
                Icons.donut_small,
                size: 40,
              ),
        textColor: Colors.white,
      ),
    );
  }
}
