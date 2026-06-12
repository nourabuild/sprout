// Do not edit directly, this file was auto-generated.

import SwiftUI

enum SproutTheme {
  enum Colors {
    enum Light {
      static let brand: Color = Color(red: 0, green: 0.639216, blue: 1, opacity: 1)
      static let text: Color = Color(red: 0.058824, green: 0.090196, blue: 0.164706, opacity: 1)
      static let background: Color = Color(red: 0.972549, green: 0.980392, blue: 0.988235, opacity: 1)
      static let surface: Color = Color(red: 0.945098, green: 0.960784, blue: 0.976471, opacity: 1)
      static let selected: Color = Color(red: 0.886275, green: 0.909804, blue: 0.941176, opacity: 1)
      static let textSecondary: Color = Color(red: 0.392157, green: 0.454902, blue: 0.545098, opacity: 1)
      enum Success {
        static let background: Color = Color(red: 0.862745, green: 0.988235, blue: 0.905882, opacity: 1)
        static let text: Color = Color(red: 0.086275, green: 0.639216, blue: 0.290196, opacity: 1)
      }
      enum Warning {
        static let background: Color = Color(red: 0.996078, green: 0.952941, blue: 0.780392, opacity: 1)
        static let text: Color = Color(red: 0.85098, green: 0.466667, blue: 0.023529, opacity: 1)
      }
      enum Error {
        static let background: Color = Color(red: 0.996078, green: 0.886275, blue: 0.886275, opacity: 1)
        static let text: Color = Color(red: 0.862745, green: 0.14902, blue: 0.14902, opacity: 1)
      }
      enum Info {
        static let background: Color = Color(red: 0.878431, green: 0.956863, blue: 1, opacity: 1)
        static let text: Color = Color(red: 0, green: 0.639216, blue: 1, opacity: 1)
      }
    }
    enum Dark {
      static let brand: Color = Color(red: 0, green: 0.639216, blue: 1, opacity: 1)
      static let text: Color = Color(red: 0.972549, green: 0.980392, blue: 0.988235, opacity: 1)
      static let background: Color = Color(red: 0.058824, green: 0.090196, blue: 0.164706, opacity: 1)
      static let surface: Color = Color(red: 0.117647, green: 0.160784, blue: 0.231373, opacity: 1)
      static let selected: Color = Color(red: 0.2, green: 0.254902, blue: 0.333333, opacity: 1)
      static let textSecondary: Color = Color(red: 0.580392, green: 0.639216, blue: 0.721569, opacity: 1)
      enum Success {
        static let background: Color = Color(red: 0.086275, green: 0.396078, blue: 0.203922, opacity: 1)
      }
      enum Warning {
        static let background: Color = Color(red: 0.470588, green: 0.207843, blue: 0.058824, opacity: 1)
      }
      enum Error {
        static let background: Color = Color(red: 0.6, green: 0.105882, blue: 0.105882, opacity: 1)
      }
      enum Info {
        static let background: Color = Color(red: 0.011765, green: 0.411765, blue: 0.631373, opacity: 1)
      }
    }
  }
  enum Spacing {
    static let s0: CGFloat = 0
    static let s1: CGFloat = 4
    static let s2: CGFloat = 8
    static let s3: CGFloat = 12
    static let s4: CGFloat = 16
    static let s5: CGFloat = 24
    static let s6: CGFloat = 32
    static let s7: CGFloat = 48
    static let s8: CGFloat = 64
    static let screenPadding: CGFloat = 20
  }
  enum BorderRadius {
    static let sm: CGFloat = 8
    static let md: CGFloat = 12
    static let lg: CGFloat = 16
    static let full: CGFloat = 999
  }
  enum BorderWidth {
    static let thin: CGFloat = 1
    static let standard: CGFloat = 2
  }
  enum Typography {
    enum FontSize {
      static let xs: CGFloat = 12
      static let sm: CGFloat = 13
      static let md: CGFloat = 16
      static let header: CGFloat = 18
      static let lg: CGFloat = 20
      static let xl: CGFloat = 24
    }
    enum LineHeight {
      static let xs: CGFloat = 16
      static let sm: CGFloat = 18
      static let md: CGFloat = 24
      static let header: CGFloat = 24
      static let lg: CGFloat = 28
      static let xl: CGFloat = 32
    }
  }
  enum Icon {
    static let sm: CGFloat = 16
    static let md: CGFloat = 20
    static let lg: CGFloat = 24
  }
  enum Component {
    enum InputHeight {
      static let sm: CGFloat = 40
      static let md: CGFloat = 48
      static let lg: CGFloat = 56
    }
    enum ButtonHeight {
      static let sm: CGFloat = 40
      static let md: CGFloat = 48
      static let lg: CGFloat = 56
    }
    enum Avatar {
      static let sm: CGFloat = 32
      static let md: CGFloat = 48
      static let lg: CGFloat = 72
    }
  }
  enum ZIndex {
    static let base: Int = 0
    static let dropdown: Int = 100
    static let modal: Int = 200
    static let tooltip: Int = 300
    static let navbar: Int = 400
  }
  enum Motion {
    enum Duration {
      static let fast: Double = 150
      static let normal: Double = 250
      static let slow: Double = 400
    }
    enum Spring {
      enum Gentle {
        static let tension: Int = 40
        static let friction: Int = 8
      }
      enum Snappy {
        static let tension: Int = 120
        static let friction: Int = 14
      }
    }
  }
  enum Opacity {
    static let disabled: Double = 0.5
    static let pressed: Double = 0.7
    static let muted: Double = 0.6
  }
}
