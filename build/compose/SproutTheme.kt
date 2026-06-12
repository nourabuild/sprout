// Do not edit directly, this file was auto-generated.

package com.sprout.tokens

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

object SproutTheme {
  object Colors {
    object Light {
      val brand = Color(0xFF00A3FF)
      val text = Color(0xFF0F172A)
      val background = Color(0xFFF8FAFC)
      val surface = Color(0xFFF1F5F9)
      val selected = Color(0xFFE2E8F0)
      val textSecondary = Color(0xFF64748B)
      object Success {
        val background = Color(0xFFDCFCE7)
        val text = Color(0xFF16A34A)
      }
      object Warning {
        val background = Color(0xFFFEF3C7)
        val text = Color(0xFFD97706)
      }
      object Error {
        val background = Color(0xFFFEE2E2)
        val text = Color(0xFFDC2626)
      }
      object Info {
        val background = Color(0xFFE0F4FF)
        val text = Color(0xFF00A3FF)
      }
    }
    object Dark {
      val brand = Color(0xFF00A3FF)
      val text = Color(0xFFF8FAFC)
      val background = Color(0xFF0F172A)
      val surface = Color(0xFF1E293B)
      val selected = Color(0xFF334155)
      val textSecondary = Color(0xFF94A3B8)
      object Success {
        val background = Color(0xFF166534)
      }
      object Warning {
        val background = Color(0xFF78350F)
      }
      object Error {
        val background = Color(0xFF991B1B)
      }
      object Info {
        val background = Color(0xFF0369A1)
      }
    }
  }
  object Spacing {
    val s0 = 0.dp
    val s1 = 4.dp
    val s2 = 8.dp
    val s3 = 12.dp
    val s4 = 16.dp
    val s5 = 24.dp
    val s6 = 32.dp
    val s7 = 48.dp
    val s8 = 64.dp
    val screenPadding = 20.dp
  }
  object BorderRadius {
    val sm = 8.dp
    val md = 12.dp
    val lg = 16.dp
    val full = 999.dp
  }
  object BorderWidth {
    val thin = 1.dp
    val standard = 2.dp
  }
  object Typography {
    object FontSize {
      val xs = 12.sp
      val sm = 13.sp
      val md = 16.sp
      val header = 18.sp
      val lg = 20.sp
      val xl = 24.sp
    }
    object LineHeight {
      val xs = 16.sp
      val sm = 18.sp
      val md = 24.sp
      val header = 24.sp
      val lg = 28.sp
      val xl = 32.sp
    }
  }
  object Icon {
    val sm = 16.dp
    val md = 20.dp
    val lg = 24.dp
  }
  object Component {
    object InputHeight {
      val sm = 40.dp
      val md = 48.dp
      val lg = 56.dp
    }
    object ButtonHeight {
      val sm = 40.dp
      val md = 48.dp
      val lg = 56.dp
    }
    object Avatar {
      val sm = 32.dp
      val md = 48.dp
      val lg = 72.dp
    }
  }
  object ZIndex {
    val base = 0
    val dropdown = 100
    val modal = 200
    val tooltip = 300
    val navbar = 400
  }
  object Motion {
    object Duration {
      val fast = 150
      val normal = 250
      val slow = 400
    }
    object Spring {
      object Gentle {
        val tension = 40
        val friction = 8
      }
      object Snappy {
        val tension = 120
        val friction = 14
      }
    }
  }
  object Opacity {
    val disabled = 0.5f
    val pressed = 0.7f
    val muted = 0.6f
  }
}
