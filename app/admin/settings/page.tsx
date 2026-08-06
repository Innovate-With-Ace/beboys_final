import React from "react";
import {
  Building2,
  UtensilsCrossed,
  Sliders,
  UserCog,
  Upload,
  Save,
  Lock,
  ExternalLink,
  LogOut,
  Tag,
} from "lucide-react";

// ==========================================
// 1. HEADER COMPONENT
// ==========================================
function SettingsHeader() {
  return (
    <div className="pb-2 border-b border-border/60">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Settings
      </h1>
      <p className="text-sm text-muted-foreground mt-0.5">
        Manage your restaurant profile, preferences, menu defaults, and account
        details.
      </p>
    </div>
  );
}

// ==========================================
// 2. BUSINESS PROFILE SECTION COMPONENT
// ==========================================
function BusinessProfileCard() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-xs text-card-foreground space-y-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Business Profile
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            This information will appear on receipts and customer-facing
            interfaces.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Logo Upload */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative w-20 h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/20 overflow-hidden group">
            <span className="text-xs font-bold text-muted-foreground">
              LOGO
            </span>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer">
              <Upload className="h-5 w-5" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block">
              Restaurant Logo
            </label>
            <p className="text-[11px] text-muted-foreground mb-2">
              Recommended size: 400x400px (PNG, JPG)
            </p>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-medium hover:bg-muted/50 transition-colors"
            >
              <Upload className="h-3.5 w-3.5" /> Upload New Logo
            </button>
          </div>
        </div>

        {/* Business Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Business Name
          </label>
          <input
            type="text"
            readOnly
            value="Beboys Inihaw & Restaurant"
            className="w-full rounded-lg border border-border/80 bg-muted/10 px-3.5 py-2 text-xs text-foreground focus:outline-hidden"
          />
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">
            Business Address
          </label>
          <textarea
            readOnly
            rows={2}
            value="123 Mabini Street, Brgy. San Jose, Iloilo City, 5000"
            className="w-full rounded-lg border border-border/80 bg-muted/10 px-3.5 py-2 text-xs text-foreground focus:outline-hidden resize-none"
          />
        </div>

        {/* Contact Info (Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Phone Number
            </label>
            <input
              type="text"
              readOnly
              value="+63 912 345 6789"
              className="w-full rounded-lg border border-border/80 bg-muted/10 px-3.5 py-2 text-xs text-foreground focus:outline-hidden"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Email Address
            </label>
            <input
              type="email"
              readOnly
              value="support@beboysrestaurant.com"
              className="w-full rounded-lg border border-border/80 bg-muted/10 px-3.5 py-2 text-xs text-foreground focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-border/40">
        <button
          type="button"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-medium px-4 py-2 rounded-lg shadow-sm hover:opacity-95 transition-opacity"
        >
          <Save className="h-3.5 w-3.5" /> Save Changes
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 3. MENU DEFAULTS SECTION COMPONENT
// ==========================================
function MenuDefaultsCard() {
  const dummyCategories = [
    "Rice Meals",
    "Drinks",
    "Desserts",
    "Appetizers",
    "Grill Specials",
  ];

  return (
    <div className="rounded-xl border bg-card p-6 shadow-xs text-card-foreground space-y-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-primary" />
            Menu & Categories Configuration
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage overall menu categorization settings and default groupings.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Individual menu items, pricing rules, and item-level inventory mapping
          are handled separately under the dedicated menu management section.
        </p>

        {/* Existing Categories Preview */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-muted-foreground" /> Current Active
            Categories Preview:
          </span>
          <div className="flex flex-wrap gap-2 pt-1">
            {dummyCategories.map((cat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted/40 border border-border/60 text-xs font-medium text-foreground"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation Link Card to Categories */}
        <div className="p-4 rounded-xl border border-dashed border-border/80 bg-muted/10 flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="text-xs font-semibold text-foreground">
              Manage Full Category Directory
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Add, remove, or reorder menu sections
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-background border border-border text-xs font-medium hover:bg-muted/50 transition-colors shadow-2xs"
          >
            Manage Categories{" "}
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. OPERATIONAL SETTINGS SECTION COMPONENT
// ==========================================
function OperationalSettingsCard() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-xs text-card-foreground space-y-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight flex items-center gap-2">
            <Sliders className="h-4 w-4 text-primary" />
            Operational Settings
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure POS daily cycles, sequence numbers, and receipt
            preferences.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Default servings reset time */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Default Servings Reset Time
            </label>
            <input
              type="text"
              readOnly
              value="06:00 AM"
              className="w-full rounded-lg border border-border/80 bg-muted/10 px-3.5 py-2 text-xs text-foreground focus:outline-hidden"
            />
            <p className="text-[11px] text-muted-foreground">
              Time when daily batch counts and kitchen waste logs refresh.
            </p>
          </div>

          {/* Order number format */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Order Number Format
            </label>
            <input
              type="text"
              readOnly
              value="ORD-0001"
              className="w-full rounded-lg border border-border/80 bg-muted/10 px-3.5 py-2 text-xs text-foreground focus:outline-hidden"
            />
            <p className="text-[11px] text-muted-foreground">
              Pattern sequence generated for table receipts.
            </p>
          </div>
        </div>

        {/* Receipt formatting toggles */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-medium text-foreground block">
            Receipt & Order Summary Formatting Toggles
          </label>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/10">
              <span className="text-xs text-foreground font-medium">
                Show business address on printed receipt
              </span>
              <div className="w-9 h-5 bg-primary rounded-full relative cursor-pointer flex items-center px-0.5">
                <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/10">
              <span className="text-xs text-foreground font-medium">
                Show contact number on printed receipt
              </span>
              <div className="w-9 h-5 bg-primary rounded-full relative cursor-pointer flex items-center px-0.5">
                <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/10">
              <span className="text-xs text-foreground font-medium">
                Show kitchen order notes field by default
              </span>
              <div className="w-9 h-5 bg-muted-foreground/30 rounded-full relative cursor-pointer flex items-center px-0.5">
                <div className="w-4 h-4 bg-white rounded-full mr-auto shadow-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-border/40">
        <button
          type="button"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-medium px-4 py-2 rounded-lg shadow-sm hover:opacity-95 transition-opacity"
        >
          <Save className="h-3.5 w-3.5" /> Save Operational Settings
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 5. ACCOUNT SECTION COMPONENT
// ==========================================
function AccountCard() {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-xs text-card-foreground space-y-6">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight flex items-center gap-2">
            <UserCog className="h-4 w-4 text-primary" />
            Account & Security
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your personal login credentials and administrative profile.
          </p>
        </div>
      </div>

      {/* Logged in user info block */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-border/80 bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-sm">
            AC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-foreground">
                Ace Administrator
              </h4>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              ace@beboysrestaurant.com
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-background text-xs font-medium hover:bg-muted/50 transition-colors shadow-2xs"
        >
          <Lock className="h-3.5 w-3.5 text-muted-foreground" /> Change Password
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-background text-xs font-medium hover:bg-muted/50 transition-colors shadow-2xs"
        >
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" /> Manage
          Account (Clerk)
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors ml-auto"
        >
          <LogOut className="h-3.5 w-3.5" /> Logout
        </button>
      </div>
    </div>
  );
}

// ==========================================
// MAIN SETTINGS PAGE COMPONENT
// ==========================================
export default function SettingsPage() {
  return (
    <div className="max-w-7xl  space-y-8 p-4 bg-muted/10 min-h-screen">
      {/* 1. HEADER */}
      <SettingsHeader />

      {/* Layout Grid: Left Sidebar Navigation Mockup / Right Stacked Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Side Navigation List (Visual Only) */}
        <div className="hidden lg:block lg:col-span-1 space-y-1 bg-card p-3 rounded-xl border border-border shadow-xs sticky top-6">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 py-1.5 block">
            Preferences
          </span>
          <div className="w-full text-left px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-xs flex items-center gap-2 cursor-pointer">
            <Building2 className="h-3.5 w-3.5" /> Business Profile
          </div>
          <div className="w-full text-left px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/40 font-medium text-xs flex items-center gap-2 cursor-pointer transition-colors">
            <UtensilsCrossed className="h-3.5 w-3.5" /> Menu & Categories
          </div>
          <div className="w-full text-left px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/40 font-medium text-xs flex items-center gap-2 cursor-pointer transition-colors">
            <Sliders className="h-3.5 w-3.5" /> Operational
          </div>
          <div className="w-full text-left px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted/40 font-medium text-xs flex items-center gap-2 cursor-pointer transition-colors">
            <UserCog className="h-3.5 w-3.5" /> Account & Security
          </div>
        </div>

        {/* Main Settings Content Panels */}
        <div className="lg:col-span-3 space-y-6">
          {/* 2. BUSINESS PROFILE SECTION */}
          <BusinessProfileCard />

          {/* 3. MENU/CATEGORY DEFAULTS SECTION */}
          <MenuDefaultsCard />

          {/* 4. OPERATIONAL SETTINGS SECTION */}
          <OperationalSettingsCard />

          {/* 5. ACCOUNT SECTION */}
          <AccountCard />
        </div>
      </div>
    </div>
  );
}
