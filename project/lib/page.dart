import 'package:flutter/material.dart';

class MyPageView extends StatefulWidget {
  MyPageView({Key key, this.children}) : super(key: key);

  final List<Widget> children;
  final PageController ctrl = PageController();

  void scrollTo(int page) {
    if (ctrl.hasClients) {
      ctrl.animateToPage(
        page,
        duration: Duration(milliseconds: 600),
        curve: Curves.easeInOut,
      );
    }
  }

  @override
  _MyPageViewState createState() => _MyPageViewState();
}

class _MyPageViewState extends State<MyPageView> {
  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scrollbar(
      child: PageView(
        pageSnapping: false,
        controller: widget.ctrl,
        scrollDirection: Axis.vertical,
        children: widget.children,
      ),
    );
  }
}
