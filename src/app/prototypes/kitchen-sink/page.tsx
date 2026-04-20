"use client"

import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { IconButton, iconButtonVariants } from "@/components/ui/icon-button";
import { ToggleButton } from "@/components/ui/toggle-button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import type { VariantProps } from "class-variance-authority";
type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
type IconButtonVariant = NonNullable<VariantProps<typeof iconButtonVariants>["variant"]>;
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from "@/components/ui/select";
import { FormField } from "@/components/ui/form-field";
import { Checkbox, CheckboxItem } from "@/components/ui/checkbox";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { Calendar } from "@/components/ui/calendar";
import { DatePicker } from "@/components/ui/date-picker";
import { DateTimeInput } from "@/components/ui/date-time-input";
import { NumberInput } from "@/components/ui/number-input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ProgressBar, ProgressCircle } from "@/components/ui/progress-bar";
import { Chart } from "@/components/ui/chart";
import { Pill } from "@/components/ui/pill";
import { Tag } from "@/components/ui/tag";
import { Link } from "@/components/ui/link";
import { FileDrop } from "@/components/ui/file-drop";
import { Pagination } from "@/components/ui/pagination";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Tooltip } from "@/components/ui/tooltip";
import { AppShell, type SidebarNavItem, type TopNavAction } from "@/components/ui/app-shell";
import { Separator } from "@/components/ui/separator";
import { Icon, type IconSize, type IconColor } from "@/components/ui/icon";
import {
  Star,
  Bell,
  CircleCheck,
  TriangleAlert,
  CircleX,
  Info,
  Settings,
  Home,
  User,
  Search,
  ArrowRight,
  Heart,
  Zap,
  Mail,
  Eye,
  Globe,
  Building2,
  MapPin,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Circle,
  Tag as TagIcon,
  Folder,
  ShieldUser,
  LayoutDashboard,
  BookText,
  CalendarDays,
  Inbox,
  LayoutGrid,
  Users,
  CircleHelp,
  Clock,
  Video,
  GraduationCap,
} from "lucide-react";

const TOP_NAV_ACTIONS: TopNavAction[] = [
  { id: "ignite", label: "IgniteAI Agent", variant: "aiPrimary" },
];

const SIDEBAR_ITEMS: SidebarNavItem[] = [
  { id: "account",   label: "Account",   avatar: { src: "https://i.pravatar.cc/150?img=47" } },
  { id: "admin",     label: "Admin",     icon: ShieldUser,     adminOnly: true },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "courses",   label: "Courses",   icon: BookText },
  { id: "calendar",  label: "Calendar",  icon: CalendarDays },
  { id: "inbox",     label: "Inbox",     icon: Inbox },
  { id: "history",   label: "History",   icon: Clock },
  { id: "help",      label: "Help",      icon: CircleHelp },
];

function PaginationDemo() {
  const [numericPage, setNumericPage] = React.useState(3);
  const [numericLargePage, setNumericLargePage] = React.useState(10);
  const [alphaPage, setAlphaPage] = React.useState("A-G");
  const [jumpPage, setJumpPage] = React.useState(5);

  return (
    <div>
      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
        PAGINATION
      </p>
      <div className="space-y-6">
        <Pagination
          variant="numeric"
          currentPage={numericPage}
          totalPages={7}
          onPageChange={setNumericPage}
        />
        <Pagination
          variant="numeric"
          currentPage={numericLargePage}
          totalPages={20}
          onPageChange={setNumericLargePage}
        />
        <Pagination
          variant="alphabetical"
          pages={["A-G", "H-N", "O-T", "U-Z"]}
          currentPage={alphaPage}
          onPageChange={setAlphaPage}
        />
        <Pagination
          variant="jumpto"
          currentPage={jumpPage}
          totalPages={160}
          onPageChange={setJumpPage}
        />
      </div>
    </div>
  );
}

export default function ThemeReference() {
  const [sidebarActiveId, setSidebarActiveId] = React.useState("courses");

  return (
    <Tabs variant="primary" defaultValue="tokens">
      <AppShell
        sidebarItems={SIDEBAR_ITEMS}
        sidebarActiveId={sidebarActiveId}
        onSidebarSelect={setSidebarActiveId}
        sidebarIsAdmin={true}
        sidebarLogo={
          <img src={`${process.env.NEXT_PUBLIC_BASE_PATH}/svg/canvas.svg`} alt="Canvas" width={40} height={40} />
        }
        sidebarLogoHref="/prototypes"
        breadcrumb={[
          { label: "Prototypes", href: "/prototypes" },
          { label: "Theme Reference" },
        ]}
        topNavActions={TOP_NAV_ACTIONS}
        pageTitle="Theme Reference"
        pageDescription="Visual baseline for all vibe coding prototypes."
        pageDataPoints="canvas-vibe-template"
        pageLabels={
          <>
            <Pill status="Design Tokens" />
            <Pill color="info" status="Components" />
          </>
        }
        pageTabNav={
          <TabsList>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>
        }
        pageActions={
          <Button variant="primary" size="md">Export</Button>
        }
      >
        <div className="flex flex-col gap-4">
          <TabsContent value="tokens">
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader><CardTitle>Typography</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
                        HEADINGS — Inclusive Sans
                      </p>
                      <div className="space-y-3">
                        <h1>Page Title (40px)</h1>
                        <h2>Section Heading (28px)</h2>
                        <h3>Module Title (24px)</h3>
                        <h4>Card Heading (20px)</h4>
                        <h5>Card Mini / Label (16px)</h5>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
                        BODY — Atkinson Hyperlegible Next
                      </p>
                      <div className="space-y-2">
                        <p className="text-xl">Description Page — 20px regular</p>
                        <p className="text-base">Content — 16px regular</p>
                        <p className="text-base font-semibold">Content Important — 16px semibold</p>
                        <p className="text-sm">Content Small — 14px regular</p>
                        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                          Legend — 12px regular
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
                        TEXT COLORS
                      </p>
                      <div className="space-y-1">
                        <p style={{ color: "var(--foreground)" }}>text.base — #334451</p>
                        <p style={{ color: "var(--muted-foreground)" }}>text.muted — #4A5B68</p>
                        <p style={{ color: "var(--color-text-placeholder)" }}>text.placeholder — #6A7883</p>
                        <p style={{ color: "var(--color-text-disabled)" }}>text.disabled — #8D959F</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Color Tokens</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
                        BACKGROUNDS
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <ColorSwatch label="base" hex="#ffffff" border />
                        <ColorSwatch label="page / muted" hex="#F2F4F4" border />
                        <ColorSwatch label="divider" hex="#D7DADE" />
                        <ColorSwatch label="stroke.base" hex="#8D959F" />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
                        INTERACTIVE — PRIMARY (BLUE)
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <ColorSwatch label="base" hex="#2B7ABC" />
                        <ColorSwatch label="hover" hex="#3C85C1" />
                        <ColorSwatch label="active" hex="#1D71B8" />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
                        INTERACTIVE — SECONDARY (GREY)
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <ColorSwatch label="base" hex="#586874" />
                        <ColorSwatch label="hover" hex="#6A7883" />
                        <ColorSwatch label="active" hex="#4A5B68" />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
                        SEMANTIC
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <ColorSwatch label="success" hex="#03893D" />
                        <ColorSwatch label="warning" hex="#CF4A00" />
                        <ColorSwatch label="error" hex="#E62429" />
                        <ColorSwatch label="info" hex="#2B7ABC" />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
                        ACCENT / CHART
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <ColorSwatch label="color1" hex="#197EAB" />
                        <ColorSwatch label="color2" hex="#048660" />
                        <ColorSwatch label="color3" hex="#C54396" />
                        <ColorSwatch label="color4" hex="#996E00" />
                        <ColorSwatch label="color5" hex="#4E4E4E" />
                        <ColorSwatch label="color6" hex="#767676" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="components">
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader><CardTitle>Components</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* ── All Pencil variants × sm/md/lg × no-icon / left-icon ── */}
                    {(([
                      ["primary",              "primary"],
                      ["secondary",            "secondary"],
                      ["tertiary",             "tertiary"],
                      ["destructivePrimary",   "destructivePrimary"],
                      ["destructiveSecondary", "destructiveSecondary"],
                      ["successPrimary",       "successPrimary"],
                      ["successSecondary",     "successSecondary"],
                      ["aiPrimary",            "aiPrimary"],
                      ["aiSecondary",          "aiSecondary"],
                    ] as [ButtonVariant, string][]).map(([v, label]) => (
                      <div key={v}>
                        <p className="text-xs mb-3 font-mono" style={{ color: "var(--color-text-muted)" }}>{label}</p>
                        <div className="flex flex-wrap items-end gap-2">
                          <Button variant={v} size="sm">Button</Button>
                          <Button variant={v} size="md">Button</Button>
                          <Button variant={v} size="lg">Button</Button>
                          <div className="w-px mx-1 self-stretch" style={{ backgroundColor: "var(--border)" }} />
                          <Button variant={v} size="sm" leftIcon={Star}>Button</Button>
                          <Button variant={v} size="md" leftIcon={Star}>Button</Button>
                          <Button variant={v} size="lg" leftIcon={Star}>Button</Button>
                        </div>
                      </div>
                    )))}

                    {/* ── onColor variants need a dark background ── */}
                    <div className="rounded-lg p-4 space-y-4" style={{ backgroundColor: "var(--btn-primary-bg)" }}>
                      {(([
                        ["onColorPrimary",   "onColorPrimary"],
                        ["onColorSecondary", "onColorSecondary"],
                      ] as [ButtonVariant, string][]).map(([v, label]) => (
                        <div key={v}>
                          <p className="text-xs mb-3 font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
                          <div className="flex flex-wrap items-end gap-2">
                            <Button variant={v} size="sm">Button</Button>
                            <Button variant={v} size="md">Button</Button>
                            <Button variant={v} size="lg">Button</Button>
                            <div className="w-px mx-1 self-stretch" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
                            <Button variant={v} size="sm" leftIcon={Star}>Button</Button>
                            <Button variant={v} size="md" leftIcon={Star}>Button</Button>
                            <Button variant={v} size="lg" leftIcon={Star}>Button</Button>
                          </div>
                        </div>
                      )))}
                    </div>

                    {/* ── IconButton: all variants × sm/md/lg × base/circle shapes ── */}
                    <div>
                      <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>ICON BUTTONS</p>
                    </div>
                    {(([
                      ["primary",              "primary"],
                      ["secondary",            "secondary"],
                      ["tertiary",             "tertiary"],
                      ["destructivePrimary",   "destructivePrimary"],
                      ["destructiveSecondary", "destructiveSecondary"],
                      ["successPrimary",       "successPrimary"],
                      ["successSecondary",     "successSecondary"],
                      ["aiPrimary",            "aiPrimary"],
                      ["aiSecondary",          "aiSecondary"],
                      ["ghost",                "ghost"],
                    ] as [IconButtonVariant, string][]).map(([v, label]) => (
                      <div key={v}>
                        <p className="text-xs mb-3 font-mono" style={{ color: "var(--color-text-muted)" }}>{label}</p>
                        <div className="flex flex-wrap items-end gap-2">
                          <IconButton variant={v} size="sm" shape="base" icon={Star} />
                          <IconButton variant={v} size="md" shape="base" icon={Star} />
                          <IconButton variant={v} size="lg" shape="base" icon={Star} />
                          <div className="w-px mx-1 self-stretch" style={{ backgroundColor: "var(--border)" }} />
                          <IconButton variant={v} size="sm" shape="circle" icon={Star} />
                          <IconButton variant={v} size="md" shape="circle" icon={Star} />
                          <IconButton variant={v} size="lg" shape="circle" icon={Star} />
                        </div>
                      </div>
                    )))}

                    {/* ── onColor icon buttons need a dark background ── */}
                    <div className="rounded-lg p-4 space-y-4" style={{ backgroundColor: "var(--btn-primary-bg)" }}>
                      {(([
                        ["onColorPrimary",   "onColorPrimary"],
                        ["onColorSecondary", "onColorSecondary"],
                        ["ghostOnColor",     "ghostOnColor"],
                      ] as [IconButtonVariant, string][]).map(([v, label]) => (
                        <div key={v}>
                          <p className="text-xs mb-3 font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
                          <div className="flex flex-wrap items-end gap-2">
                            <IconButton variant={v} size="sm" shape="base" icon={Star} />
                            <IconButton variant={v} size="md" shape="base" icon={Star} />
                            <IconButton variant={v} size="lg" shape="base" icon={Star} />
                            <div className="w-px mx-1 self-stretch" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
                            <IconButton variant={v} size="sm" shape="circle" icon={Star} />
                            <IconButton variant={v} size="md" shape="circle" icon={Star} />
                            <IconButton variant={v} size="lg" shape="circle" icon={Star} />
                          </div>
                        </div>
                      )))}
                    </div>

                    {/* ── Toggle Buttons ── */}
                    <div>
                      <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>TOGGLE BUTTONS</p>
                    </div>
                    <div>
                      <p className="text-xs mb-3 font-mono" style={{ color: "var(--color-text-muted)" }}>base — off</p>
                      <div className="flex flex-wrap items-end gap-2">
                        <ToggleButton size="sm" shape="base" icon={Star} />
                        <ToggleButton size="md" shape="base" icon={Star} />
                        <ToggleButton size="lg" shape="base" icon={Star} />
                        <div className="w-px mx-1 self-stretch" style={{ backgroundColor: "var(--border)" }} />
                        <ToggleButton size="sm" shape="circle" icon={Star} />
                        <ToggleButton size="md" shape="circle" icon={Star} />
                        <ToggleButton size="lg" shape="circle" icon={Star} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs mb-3 font-mono" style={{ color: "var(--color-text-muted)" }}>base — on</p>
                      <div className="flex flex-wrap items-end gap-2">
                        <ToggleButton size="sm" shape="base" icon={Star} defaultPressed />
                        <ToggleButton size="md" shape="base" icon={Star} defaultPressed />
                        <ToggleButton size="lg" shape="base" icon={Star} defaultPressed />
                        <div className="w-px mx-1 self-stretch" style={{ backgroundColor: "var(--border)" }} />
                        <ToggleButton size="sm" shape="circle" icon={Star} defaultPressed />
                        <ToggleButton size="md" shape="circle" icon={Star} defaultPressed />
                        <ToggleButton size="lg" shape="circle" icon={Star} defaultPressed />
                      </div>
                    </div>

                    <div className="rounded-lg p-4 space-y-4" style={{ backgroundColor: "var(--btn-primary-bg)" }}>
                      <div>
                        <p className="text-xs mb-3 font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>onColor — off</p>
                        <div className="flex flex-wrap items-end gap-2">
                          <ToggleButton variant="onColor" size="sm" shape="base" icon={Star} />
                          <ToggleButton variant="onColor" size="md" shape="base" icon={Star} />
                          <ToggleButton variant="onColor" size="lg" shape="base" icon={Star} />
                          <div className="w-px mx-1 self-stretch" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
                          <ToggleButton variant="onColor" size="sm" shape="circle" icon={Star} />
                          <ToggleButton variant="onColor" size="md" shape="circle" icon={Star} />
                          <ToggleButton variant="onColor" size="lg" shape="circle" icon={Star} />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs mb-3 font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>onColor — on</p>
                        <div className="flex flex-wrap items-end gap-2">
                          <ToggleButton variant="onColor" size="sm" shape="base" icon={Star} defaultPressed />
                          <ToggleButton variant="onColor" size="md" shape="base" icon={Star} defaultPressed />
                          <ToggleButton variant="onColor" size="lg" shape="base" icon={Star} defaultPressed />
                          <div className="w-px mx-1 self-stretch" style={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
                          <ToggleButton variant="onColor" size="sm" shape="circle" icon={Star} defaultPressed />
                          <ToggleButton variant="onColor" size="md" shape="circle" icon={Star} defaultPressed />
                          <ToggleButton variant="onColor" size="lg" shape="circle" icon={Star} defaultPressed />
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        TABS
                      </p>
                      <div className="space-y-8">
                        <div>
                          <p className="text-xs mb-4 font-mono" style={{ color: "var(--color-text-muted)" }}>primary</p>
                          <Tabs defaultValue="overview" variant="primary">
                            <TabsList>
                              <TabsTrigger value="overview">Overview</TabsTrigger>
                              <TabsTrigger value="details">Details</TabsTrigger>
                              <TabsTrigger value="settings">Settings</TabsTrigger>
                              <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="pt-4">
                              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Overview tab content — this panel changes when you switch tabs.</p>
                            </TabsContent>
                            <TabsContent value="details" className="pt-4">
                              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Details tab content.</p>
                            </TabsContent>
                            <TabsContent value="settings" className="pt-4">
                              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Settings tab content.</p>
                            </TabsContent>
                          </Tabs>
                        </div>

                        <div>
                          <p className="text-xs mb-4 font-mono" style={{ color: "var(--color-text-muted)" }}>secondary</p>
                          <Tabs defaultValue="overview" variant="secondary">
                            <TabsList>
                              <TabsTrigger value="overview">Overview</TabsTrigger>
                              <TabsTrigger value="details">Details</TabsTrigger>
                              <TabsTrigger value="settings">Settings</TabsTrigger>
                              <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="pt-4">
                              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Overview tab content — this panel changes when you switch tabs.</p>
                            </TabsContent>
                            <TabsContent value="details" className="pt-4">
                              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Details tab content.</p>
                            </TabsContent>
                            <TabsContent value="settings" className="pt-4">
                              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Settings tab content.</p>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        POPOVERS
                      </p>
                      <div className="space-y-4">
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>variants — default / inverse · sides — bottom / top / right / left · aligns — start / center / end</p>
                        <div className="flex flex-wrap gap-3 items-center py-8">
                          {/* Default variant — bottom, various aligns */}
                          <Popover variant="default">
                            <PopoverTrigger asChild>
                              <Button variant="tertiary" size="sm">↓ start</Button>
                            </PopoverTrigger>
                            <PopoverContent side="bottom" align="start" className="p-3 text-sm w-48">
                              Popover content — bottom start
                            </PopoverContent>
                          </Popover>

                          <Popover variant="default">
                            <PopoverTrigger asChild>
                              <Button variant="tertiary" size="sm">↓ center</Button>
                            </PopoverTrigger>
                            <PopoverContent side="bottom" align="center" className="p-3 text-sm w-48">
                              Popover content — bottom center
                            </PopoverContent>
                          </Popover>

                          <Popover variant="default">
                            <PopoverTrigger asChild>
                              <Button variant="tertiary" size="sm">↓ end</Button>
                            </PopoverTrigger>
                            <PopoverContent side="bottom" align="end" className="p-3 text-sm w-48">
                              Popover content — bottom end
                            </PopoverContent>
                          </Popover>

                          <Popover variant="default">
                            <PopoverTrigger asChild>
                              <Button variant="tertiary" size="sm">↑ center</Button>
                            </PopoverTrigger>
                            <PopoverContent side="top" align="center" className="p-3 text-sm w-48">
                              Popover content — top center
                            </PopoverContent>
                          </Popover>

                          <Popover variant="default">
                            <PopoverTrigger asChild>
                              <Button variant="tertiary" size="sm">→ center</Button>
                            </PopoverTrigger>
                            <PopoverContent side="right" align="center" className="p-3 text-sm w-48">
                              Popover content — right center
                            </PopoverContent>
                          </Popover>

                          <Popover variant="default">
                            <PopoverTrigger asChild>
                              <Button variant="tertiary" size="sm">← center</Button>
                            </PopoverTrigger>
                            <PopoverContent side="left" align="center" className="p-3 text-sm w-48">
                              Popover content — left center
                            </PopoverContent>
                          </Popover>

                          {/* Inverse variant */}
                          <Popover variant="inverse">
                            <PopoverTrigger asChild>
                              <Button variant="primary" size="sm">↓ inverse</Button>
                            </PopoverTrigger>
                            <PopoverContent side="bottom" align="center" className="p-3 text-sm w-48">
                              Popover content — inverse
                            </PopoverContent>
                          </Popover>

                          <Popover variant="default">
                            <PopoverTrigger asChild>
                              <Button variant="secondary" size="sm">no arrow</Button>
                            </PopoverTrigger>
                            <PopoverContent side="bottom" align="center" showArrow={false} className="p-3 text-sm w-48">
                              Popover without arrow
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        MODALS
                      </p>
                      <div className="space-y-4">
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>variants — default / inverse</p>
                        <div className="flex gap-3">
                          {/* Default (light) modal */}
                          <Dialog variant="default">
                            <DialogTrigger asChild>
                              <Button variant="secondary">Open Default Modal</Button>
                            </DialogTrigger>
                            <DialogContent size="sm">
                              <DialogHeader>
                                <DialogTitle>Confirm Action</DialogTitle>
                                <DialogDescription>Review the details before proceeding.</DialogDescription>
                              </DialogHeader>
                              <DialogBody>
                                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                                  This action will update your account settings. Changes take effect immediately and cannot be undone without contacting support.
                                </p>
                              </DialogBody>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="secondary">Cancel</Button>
                                </DialogClose>
                                <Button variant="primary">Confirm</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {/* Inverse (dark) modal */}
                          <Dialog variant="inverse">
                            <DialogTrigger asChild>
                              <Button variant="primary">Open Inverse Modal</Button>
                            </DialogTrigger>
                            <DialogContent size="sm">
                              <DialogHeader>
                                <DialogTitle>Confirm Action</DialogTitle>
                                <DialogDescription>Review the details before proceeding.</DialogDescription>
                              </DialogHeader>
                              <DialogBody>
                                <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                                  This action will update your account settings. Changes take effect immediately and cannot be undone without contacting support.
                                </p>
                              </DialogBody>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="onColorSecondary">Cancel</Button>
                                </DialogClose>
                                <Button variant="onColorPrimary">Confirm</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        BADGES
                      </p>
                      <div className="space-y-4">
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>number — info · success · error · onColor</p>
                        <div className="flex flex-wrap items-center gap-4">
                          <Badge type="number" color="info" count={9} />
                          <Badge type="number" color="success" count={9} />
                          <Badge type="number" color="error" count={9} />
                          <div className="rounded p-2" style={{ backgroundColor: "var(--btn-primary-bg)" }}>
                            <Badge type="number" color="onColor" count={9} />
                          </div>
                        </div>
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>number — multi-digit · capped at 99+</p>
                        <div className="flex flex-wrap items-center gap-4">
                          <Badge type="number" color="error" count={42} />
                          <Badge type="number" color="error" count={99} />
                          <Badge type="number" color="error" count={120} />
                        </div>
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>dot — info · success · error · onColor</p>
                        <div className="flex flex-wrap items-center gap-4">
                          <Badge type="dot" color="info" />
                          <Badge type="dot" color="success" />
                          <Badge type="dot" color="error" />
                          <div className="rounded p-2" style={{ backgroundColor: "var(--btn-primary-bg)" }}>
                            <Badge type="dot" color="onColor" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        PROGRESS BAR
                      </p>
                      <div className="flex flex-col gap-4" style={{ maxWidth: 400 }}>
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>primary — xs · sm · md · lg</p>
                        <ProgressBar value={60} size="xs" />
                        <ProgressBar value={60} size="sm" />
                        <ProgressBar value={60} size="md" />
                        <ProgressBar value={60} size="lg" />
                        <p className="text-xs font-mono mt-2" style={{ color: "var(--color-text-muted)" }}>complete state</p>
                        <ProgressBar value={100} size="sm" />
                        <ProgressBar value={100} size="md" />
                        <p className="text-xs font-mono mt-2" style={{ color: "var(--color-text-muted)" }}>no label</p>
                        <ProgressBar value={40} size="md" showLabel={false} />
                      </div>
                      <div className="flex flex-col gap-4 mt-4 rounded-xl p-4" style={{ maxWidth: 400, backgroundColor: "var(--btn-primary-bg)" }}>
                        <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>inverse — on dark background</p>
                        <ProgressBar value={60} size="sm" color="inverse" />
                        <ProgressBar value={60} size="md" color="inverse" />
                        <ProgressBar value={100} size="md" color="inverse" />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        PROGRESS CIRCLE
                      </p>
                      <div className="flex flex-col gap-6">
                        <div>
                          <p className="text-xs font-mono mb-3" style={{ color: "var(--color-text-muted)" }}>percentage — xs · sm · md · lg</p>
                          <div className="flex items-end gap-6">
                            <ProgressCircle value={60} size="xs" />
                            <ProgressCircle value={60} size="sm" />
                            <ProgressCircle value={60} size="md" />
                            <ProgressCircle value={60} size="lg" />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-mono mb-3" style={{ color: "var(--color-text-muted)" }}>complete &amp; zero states</p>
                          <div className="flex items-end gap-6">
                            <ProgressCircle value={0} size="md" />
                            <ProgressCircle value={100} size="md" />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-mono mb-3" style={{ color: "var(--color-text-muted)" }}>fractional — 40/60 · 100/100</p>
                          <div className="flex items-end gap-6">
                            <ProgressCircle value={40} total={60} type="fractional" size="sm" />
                            <ProgressCircle value={40} total={60} type="fractional" size="md" />
                            <ProgressCircle value={100} total={100} type="fractional" size="md" />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-mono mb-3" style={{ color: "var(--color-text-muted)" }}>slot — custom center content</p>
                          <div className="flex items-end gap-6">
                            <ProgressCircle value={75} type="slot" size="sm">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1d354f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            </ProgressCircle>
                            <ProgressCircle value={75} type="slot" size="md">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1d354f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            </ProgressCircle>
                          </div>
                        </div>
                        <div className="rounded-xl p-4" style={{ backgroundColor: "var(--btn-primary-bg)" }}>
                          <p className="text-xs font-mono mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>inverse — on dark background</p>
                          <div className="flex items-end gap-6">
                            <ProgressCircle value={60} size="sm" color="inverse" />
                            <ProgressCircle value={60} size="md" color="inverse" />
                            <ProgressCircle value={40} total={60} type="fractional" size="md" color="inverse" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        CHARTS
                      </p>
                      <div className="flex flex-col gap-8" style={{ maxWidth: 600 }}>
                        <div>
                          <p className="text-xs font-mono mb-3" style={{ color: "var(--color-text-muted)" }}>line — time series</p>
                          <Chart options={{
                            chart: { type: "line", height: 220, backgroundColor: "transparent", style: { fontFamily: "var(--font-body)" } },
                            title: { text: undefined },
                            credits: { enabled: false },
                            legend: { enabled: false },
                            xAxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"], lineColor: "#e2e6e9", tickColor: "#e2e6e9", labels: { style: { color: "#576773", fontSize: "12px" } } },
                            yAxis: { title: { text: undefined }, gridLineColor: "#e2e6e9", labels: { style: { color: "#576773", fontSize: "12px" } } },
                            series: [{ type: "line", name: "Value", data: [42, 58, 51, 74, 68, 89, 95], color: "#197eab", marker: { fillColor: "#197eab", lineColor: "#197eab" } }],
                          }} />
                        </div>
                        <div>
                          <p className="text-xs font-mono mb-3" style={{ color: "var(--color-text-muted)" }}>column — category comparison</p>
                          <Chart options={{
                            chart: { type: "column", height: 220, backgroundColor: "transparent", style: { fontFamily: "var(--font-body)" } },
                            title: { text: undefined },
                            credits: { enabled: false },
                            legend: { enabled: false },
                            xAxis: { categories: ["Q1", "Q2", "Q3", "Q4"], lineColor: "#e2e6e9", tickColor: "#e2e6e9", labels: { style: { color: "#576773", fontSize: "12px" } } },
                            yAxis: { title: { text: undefined }, gridLineColor: "#e2e6e9", labels: { style: { color: "#576773", fontSize: "12px" } } },
                            plotOptions: { column: { borderRadius: 4, borderWidth: 0 } },
                            series: [{ type: "column", name: "Revenue", data: [120, 180, 150, 210], color: "#197eab" }, { type: "column", name: "Cost", data: [80, 100, 95, 130], color: "#048660" }],
                          }} />
                        </div>
                        <div>
                          <p className="text-xs font-mono mb-3" style={{ color: "var(--color-text-muted)" }}>pie — proportion breakdown</p>
                          <Chart options={{
                            chart: { type: "pie", height: 220, backgroundColor: "transparent", style: { fontFamily: "var(--font-body)" } },
                            title: { text: undefined },
                            credits: { enabled: false },
                            plotOptions: { pie: { innerSize: "55%", borderWidth: 0, dataLabels: { enabled: true, style: { fontSize: "12px", fontWeight: "400", color: "#576773" } } } },
                            series: [{ type: "pie", name: "Share", data: [
                              { name: "Category A", y: 40, color: "#197eab" },
                              { name: "Category B", y: 30, color: "#048660" },
                              { name: "Category C", y: 20, color: "#c54396" },
                              { name: "Category D", y: 10, color: "#996e00" },
                            ] }],
                          }} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        PILLS
                      </p>
                      <div className="flex flex-wrap gap-3 items-center">
                        <Pill status="Neutral" />
                        <Pill color="info" status="Info" />
                        <Pill color="warning" status="Warning" />
                        <Pill color="success" status="Success" />
                        <Pill color="error" status="Error" />
                      </div>
                      <div className="flex flex-wrap gap-3 items-center mt-3">
                        <Pill color="neutral" icon={Circle} status="Status" />
                        <Pill color="info" icon={Info} status="Status" />
                        <Pill color="warning" icon={AlertTriangle} status="Status" />
                        <Pill color="success" icon={CheckCircle} status="Status" />
                        <Pill color="error" icon={AlertCircle} status="Status" />
                      </div>
                      <div className="flex flex-wrap gap-3 items-center mt-3">
                        <Pill color="neutral" icon={TagIcon} label="Type" status="Draft" />
                        <Pill color="info" icon={Info} label="Status" status="In Review" />
                        <Pill color="warning" icon={AlertTriangle} label="Priority" status="High" />
                        <Pill color="success" icon={CheckCircle} label="Status" status="Approved" />
                        <Pill color="error" icon={AlertCircle} label="Status" status="Rejected" />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        TAGS
                      </p>
                      <div className="flex flex-wrap gap-3 items-center">
                        <Tag size="sm">Small</Tag>
                        <Tag size="md">Medium</Tag>
                        <Tag size="lg">Large</Tag>
                      </div>
                      <div className="flex flex-wrap gap-3 items-center mt-3">
                        <Tag size="sm" icon={TagIcon}>With Icon</Tag>
                        <Tag size="md" icon={Folder}>With Icon</Tag>
                        <Tag size="lg" icon={Star}>With Icon</Tag>
                      </div>
                      <div className="flex flex-wrap gap-3 items-center mt-3">
                        <Tag size="sm" onDismiss={() => {}}>Dismissible</Tag>
                        <Tag size="md" icon={TagIcon} onDismiss={() => {}}>With Icon</Tag>
                        <Tag size="lg" icon={Star} onDismiss={() => {}}>Dismissible</Tag>
                      </div>
                      <div className="flex flex-wrap gap-3 items-center mt-3">
                        <Tag size="sm" disabled>Disabled</Tag>
                        <Tag size="md" icon={TagIcon} disabled>Disabled</Tag>
                        <Tag size="md" icon={TagIcon} onDismiss={() => {}} disabled>Disabled</Tag>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        LINKS
                      </p>
                      <div className="flex flex-wrap gap-6 items-center">
                        <Link href="#">Small</Link>
                        <Link href="#" size="md">Medium</Link>
                        <Link href="#" size="lg">Large</Link>
                      </div>
                      <div className="flex flex-wrap gap-6 items-center mt-3">
                        <Link href="#" icon={ArrowRight} iconPlacement="end">With icon end</Link>
                        <Link href="#" icon={ArrowRight}>With icon start</Link>
                        <Link href="#" icon={ChevronRight} iconPlacement="end" size="lg">Large</Link>
                      </div>
                      <div className="flex flex-wrap gap-6 items-center mt-3">
                        <Link href="#" disabled>Disabled</Link>
                        <Link href="#" icon={ArrowRight} disabled>Disabled icon</Link>
                      </div>
                      <div className="flex flex-wrap gap-6 items-center mt-3 rounded-lg p-3" style={{ background: "var(--btn-primary-bg)" }}>
                        <Link href="#" color="onColor" size="sm">Small</Link>
                        <Link href="#" color="onColor">Medium</Link>
                        <Link href="#" color="onColor" size="lg">Large</Link>
                        <Link href="#" color="onColor" icon={ArrowRight} iconPlacement="end">With icon</Link>
                        <Link href="#" color="onColor" disabled>Disabled</Link>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        FILE DROP
                      </p>
                      <div className="space-y-6 max-w-2xl">
                        <FileDrop onFilesSelected={(f) => console.log(f)} />
                        <FileDrop
                          error="Only PDF and image files are allowed."
                          onFilesSelected={(f) => console.log(f)}
                        />
                        <FileDrop
                          title="Upload your documents"
                          subtitle="Accepts PDF, DOCX, and images up to 20MB"
                          accept=".pdf,.docx,image/*"
                          multiple
                          onFilesSelected={(f) => console.log(f)}
                        />
                        <FileDrop disabled />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        BREADCRUMBS
                      </p>
                      <div className="space-y-4">
                        <Breadcrumb size="sm" items={[
                          { label: "Home", href: "/" },
                          { label: "Products", href: "/products" },
                          { label: "Laptops", href: "/products/laptops" },
                          { label: "MacBook Pro" },
                        ]} />
                        <Breadcrumb items={[
                          { label: "Home", href: "/" },
                          { label: "Products", href: "/products" },
                          { label: "Laptops", href: "/products/laptops" },
                          { label: "MacBook Pro" },
                        ]} />
                        <Breadcrumb size="lg" items={[
                          { label: "Home", href: "/" },
                          { label: "Products", href: "/products" },
                          { label: "MacBook Pro" },
                        ]} />
                        <Breadcrumb items={[
                          { label: "Home", href: "/", icon: Home },
                          { label: "Settings", href: "/settings", icon: Settings },
                          { label: "Profile" },
                        ]} />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        TOOLTIPS
                      </p>
                      <div className="space-y-10">
                        <div>
                          <p className="text-xs font-mono mb-8" style={{ color: "var(--color-text-muted)" }}>color=base (dark) — top / bottom / start / end</p>
                          <div className="flex flex-wrap gap-16 items-center">
                            <Tooltip content="Save your work" placement="topCenter">
                              <Button variant="secondary">topCenter</Button>
                            </Tooltip>
                            <Tooltip content="Delete this item" placement="bottomCenter">
                              <Button variant="secondary">bottomCenter</Button>
                            </Tooltip>
                            <Tooltip content="Go to settings" placement="startCenter">
                              <Button variant="secondary">startCenter</Button>
                            </Tooltip>
                            <Tooltip content="Open panel" placement="endCenter">
                              <Button variant="secondary">endCenter</Button>
                            </Tooltip>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs font-mono mb-8" style={{ color: "var(--color-text-muted)" }}>color=onColor (white) — aligned variants</p>
                          <div className="flex flex-wrap gap-16 items-center">
                            <Tooltip content="Top left aligned" placement="topStart" color="onColor">
                              <Button variant="secondary">topStart</Button>
                            </Tooltip>
                            <Tooltip content="Top right aligned" placement="topEnd" color="onColor">
                              <Button variant="secondary">topEnd</Button>
                            </Tooltip>
                            <Tooltip content="Bottom left aligned" placement="bottomStart" color="onColor">
                              <Button variant="secondary">bottomStart</Button>
                            </Tooltip>
                            <Tooltip content="Bottom right aligned" placement="bottomEnd" color="onColor">
                              <Button variant="secondary">bottomEnd</Button>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>

                    <PaginationDemo />

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        INPUTS
                      </p>
                      <div className="max-w-sm space-y-6">
                        {/* Sizes */}
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>sizes — sm / md / lg</p>
                        <FormField label="Small input" layout="stacked">
                          <Input size="sm" placeholder="Placeholder text" />
                        </FormField>
                        <FormField label="Medium input" layout="stacked">
                          <Input size="md" placeholder="Placeholder text" />
                        </FormField>
                        <FormField label="Large input" layout="stacked">
                          <Input size="lg" placeholder="Placeholder text" />
                        </FormField>
                        <FormField label="Filled value" layout="stacked">
                          <Input size="md" defaultValue="Filled input value" />
                        </FormField>

                        {/* Status */}
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>status — error / success</p>
                        <FormField label="Email" layout="stacked" status="error" message="This field is required." required>
                          <Input size="md" status="error" defaultValue="bad@" />
                        </FormField>
                        <FormField label="Username" layout="stacked" status="success" message="Username is available.">
                          <Input size="md" status="success" defaultValue="j.smith" />
                        </FormField>

                        {/* States */}
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>states — disabled / readonly</p>
                        <FormField label="Disabled" layout="stacked" hint="This field is not editable.">
                          <Input size="md" disabled placeholder="Disabled input" />
                        </FormField>
                        <FormField label="Read only" layout="stacked">
                          <Input size="md" readOnly defaultValue="Read-only value" />
                        </FormField>

                        {/* Icons */}
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>icons — left / right / both</p>
                        <FormField label="Email" layout="stacked">
                          <Input size="md" placeholder="you@example.com" leftIcon={Mail} />
                        </FormField>
                        <FormField label="Password" layout="stacked">
                          <Input size="md" type="password" placeholder="••••••••" rightIcon={Eye} />
                        </FormField>
                        <FormField label="Search" layout="stacked">
                          <Input size="md" placeholder="Search…" leftIcon={Search} rightIcon={CircleX} />
                        </FormField>
                        <FormField label="Error with icon" layout="stacked" status="error" message="Invalid email address.">
                          <Input size="md" status="error" defaultValue="bad@" leftIcon={Mail} />
                        </FormField>

                        {/* Inline layout */}
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>layout — inline</p>
                        <FormField label="Label" layout="inline">
                          <Input size="md" placeholder="Placeholder text" />
                        </FormField>
                        <FormField label="Required field" layout="inline" size="md" required status="error" message="Cannot be blank.">
                          <Input size="md" status="error" />
                        </FormField>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        TEXTAREAS
                      </p>
                      <div className="max-w-sm space-y-6">
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>default</p>
                        <FormField label="Description" layout="stacked">
                          <Textarea placeholder="Enter a description…" rows={3} />
                        </FormField>

                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>status — error / success</p>
                        <FormField label="Notes" layout="stacked" status="error" message="This field is required." required>
                          <Textarea status="error" rows={3} />
                        </FormField>
                        <FormField label="Notes" layout="stacked" status="success" message="Looks good.">
                          <Textarea status="success" defaultValue="Great content here." rows={3} />
                        </FormField>

                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>states — disabled / readonly</p>
                        <FormField label="Disabled" layout="stacked">
                          <Textarea disabled placeholder="Disabled textarea" rows={3} />
                        </FormField>
                        <FormField label="Read only" layout="stacked">
                          <Textarea readOnly defaultValue="This value cannot be edited." rows={3} />
                        </FormField>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        SELECTS
                      </p>
                      <div className="max-w-sm space-y-6">
                        {/* Sizes */}
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>sizes — sm / md</p>
                        <FormField label="Medium select" layout="stacked">
                          <Select>
                            <SelectTrigger size="md" placeholder="Select a country" />
                            <SelectContent>
                              <SelectItem value="au">Australia</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="fr">France</SelectItem>
                              <SelectItem value="de">Germany</SelectItem>
                              <SelectItem value="jp">Japan</SelectItem>
                              <SelectItem value="us">United States</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormField>
                        <FormField label="Small select" layout="stacked">
                          <Select>
                            <SelectTrigger size="sm" placeholder="Select a country" />
                            <SelectContent>
                              <SelectItem value="au">Australia</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="fr">France</SelectItem>
                              <SelectItem value="de">Germany</SelectItem>
                              <SelectItem value="jp">Japan</SelectItem>
                              <SelectItem value="us">United States</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormField>

                        {/* Icons */}
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>leading icons</p>
                        <FormField label="Region" layout="stacked">
                          <Select defaultValue="eu">
                            <SelectTrigger size="md" placeholder="Select a region" />
                            <SelectContent>
                              <SelectItem value="na" icon={MapPin}>North America</SelectItem>
                              <SelectItem value="eu" icon={Globe}>Europe</SelectItem>
                              <SelectItem value="apac" icon={Building2}>Asia Pacific</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormField>

                        {/* Trailing icons */}
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>trailing icons</p>
                        <FormField label="Priority" layout="stacked">
                          <Select>
                            <SelectTrigger size="md" placeholder="Select priority" />
                            <SelectContent>
                              <SelectItem value="low" trailingIcon={ChevronRight}>Low</SelectItem>
                              <SelectItem value="medium" trailingIcon={ChevronRight}>Medium</SelectItem>
                              <SelectItem value="high" trailingIcon={ChevronRight}>High</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormField>

                        {/* Descriptions */}
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>descriptions</p>
                        <FormField label="Plan" layout="stacked">
                          <Select defaultValue="pro">
                            <SelectTrigger size="md" placeholder="Select a plan" />
                            <SelectContent>
                              <SelectItem value="free" description="Up to 3 projects, 1GB storage">Free</SelectItem>
                              <SelectItem value="pro" description="Unlimited projects, 50GB storage">Pro</SelectItem>
                              <SelectItem value="enterprise" description="Custom limits, SSO, SLA">Enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormField>

                        {/* Dividers */}
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>inline dividers</p>
                        <FormField label="Action" layout="stacked">
                          <Select>
                            <SelectTrigger size="md" placeholder="Select an action" />
                            <SelectContent>
                              <SelectItem value="edit" icon={Settings}>Edit</SelectItem>
                              <SelectItem value="share" icon={User} divider>Share</SelectItem>
                              <SelectItem value="archive" icon={Bell}>Archive</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormField>

                        {/* Groups */}
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>groups + separator</p>
                        <FormField label="Category" layout="stacked">
                          <Select>
                            <SelectTrigger size="md" placeholder="Select a category" />
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Fruits</SelectLabel>
                                <SelectItem value="apple">Apple</SelectItem>
                                <SelectItem value="banana">Banana</SelectItem>
                                <SelectItem value="mango">Mango</SelectItem>
                              </SelectGroup>
                              <SelectSeparator />
                              <SelectGroup>
                                <SelectLabel>Vegetables</SelectLabel>
                                <SelectItem value="carrot">Carrot</SelectItem>
                                <SelectItem value="broccoli">Broccoli</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormField>

                        {/* Status */}
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>status — error / success</p>
                        <FormField label="Country" layout="stacked" status="error" message="Please select a country.">
                          <Select>
                            <SelectTrigger size="md" placeholder="Select a country" status="error" />
                            <SelectContent>
                              <SelectItem value="au">Australia</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="us">United States</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormField>
                        <FormField label="Country" layout="stacked" status="success" message="Great choice!">
                          <Select defaultValue="jp">
                            <SelectTrigger size="md" status="success" />
                            <SelectContent>
                              <SelectItem value="au">Australia</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="jp">Japan</SelectItem>
                              <SelectItem value="us">United States</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormField>

                        {/* States */}
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>states — disabled</p>
                        <FormField label="Disabled" layout="stacked" hint="This field is not editable.">
                          <Select disabled>
                            <SelectTrigger size="md" placeholder="Select an option" />
                            <SelectContent>
                              <SelectItem value="a">Option A</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormField>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        CARDS
                      </p>
                      <div className="space-y-4">
                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>base — sm / md / lg</p>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <Card size="sm">
                            <CardHeader>
                              <CardTitle>Base sm</CardTitle>
                              <CardDescription>16px padding · 12px radius</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm">Card body content.</p>
                            </CardContent>
                          </Card>
                          <Card size="md">
                            <CardHeader>
                              <CardTitle>Base md</CardTitle>
                              <CardDescription>24px padding · 16px radius</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm">Card body content.</p>
                            </CardContent>
                          </Card>
                          <Card size="lg">
                            <CardHeader>
                              <CardTitle>Base lg</CardTitle>
                              <CardDescription>32px padding · 24px radius</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm">Card body content.</p>
                            </CardContent>
                          </Card>
                        </div>

                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>nested — sm / md / lg</p>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <Card variant="nested" size="sm">
                            <CardHeader>
                              <CardTitle>Nested sm</CardTitle>
                              <CardDescription>8px padding · 12px radius</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm">Inner card content.</p>
                            </CardContent>
                          </Card>
                          <Card variant="nested" size="md">
                            <CardHeader>
                              <CardTitle>Nested md</CardTitle>
                              <CardDescription>12px padding · 16px radius</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm">Inner card content.</p>
                            </CardContent>
                          </Card>
                          <Card variant="nested" size="lg">
                            <CardHeader>
                              <CardTitle>Nested lg</CardTitle>
                              <CardDescription>16px padding · 24px radius</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm">Inner card content.</p>
                            </CardContent>
                          </Card>
                        </div>

                        <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>base + nested composition</p>
                        <Card size="md">
                          <CardHeader>
                            <CardTitle>Actions Card</CardTitle>
                            <CardDescription>Base md containing nested cards</CardDescription>
                          </CardHeader>
                          <CardContent className="gap-3">
                            <Card variant="nested" size="md">
                              <CardContent className="gap-3">
                                <p className="text-sm">Configure your settings below.</p>
                                <div className="flex gap-2">
                                  <Button size="sm">Save</Button>
                                  <Button size="sm" variant="tertiary">Cancel</Button>
                                </div>
                              </CardContent>
                            </Card>
                          </CardContent>
                          <CardFooter>
                            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Last saved 2 hours ago</p>
                          </CardFooter>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Icons</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                    Lucide icons via the <code className="text-xs font-mono px-1 py-0.5 rounded" style={{ backgroundColor: "var(--muted)", color: "var(--foreground)" }}>{"<Icon />"}</code> component. Pass any Lucide icon plus <code className="text-xs font-mono px-1 py-0.5 rounded" style={{ backgroundColor: "var(--muted)", color: "var(--foreground)" }}>size</code> and <code className="text-xs font-mono px-1 py-0.5 rounded" style={{ backgroundColor: "var(--muted)", color: "var(--foreground)" }}>color</code> props.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        SIZES — xs · sm · md · lg · xl · 2xl
                      </p>
                      <div className="flex items-end gap-6">
                        {(["xs", "sm", "md", "lg", "xl", "2xl"] as IconSize[]).map((s) => (
                          <div key={s} className="flex flex-col items-center gap-2">
                            <Icon icon={Star} size={s} />
                            <span className="text-xs font-mono" style={{ color: "var(--color-text-placeholder)" }}>{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        SEMANTIC COLORS
                      </p>
                      <div className="flex flex-wrap gap-6">
                        {([
                          ["base", Bell],
                          ["muted", Bell],
                          ["success", CircleCheck],
                          ["warning", TriangleAlert],
                          ["error", CircleX],
                          ["info", Info],
                        ] as [IconColor, typeof Bell][]).map(([color, IconComp]) => (
                          <div key={color} className="flex flex-col items-center gap-2">
                            <Icon icon={IconComp} size="lg" color={color} />
                            <span className="text-xs font-mono" style={{ color: "var(--color-text-placeholder)" }}>{color}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        ACCENT COLORS
                      </p>
                      <div className="flex flex-wrap gap-6">
                        {([
                          "accentAsh", "accentAurora", "accentBlue", "accentGreen",
                          "accentGrey", "accentHoney", "accentOrange", "accentPlum",
                          "accentRed", "accentSea", "accentSky", "accentViolet",
                        ] as IconColor[]).map((color) => (
                          <div key={color} className="flex flex-col items-center gap-2">
                            <Icon icon={Heart} size="lg" color={color} />
                            <span className="text-xs font-mono" style={{ color: "var(--color-text-placeholder)" }}>
                              {color.replace("accent", "")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        EXAMPLE USAGE — via leftIcon / rightIcon props
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button variant="primary" leftIcon={Settings}>Settings</Button>
                        <Button variant="secondary" leftIcon={User}>Profile</Button>
                        <Button variant="tertiary" leftIcon={Search}>Search</Button>
                        <Button variant="tertiary" rightIcon={ArrowRight}>Continue</Button>
                        <Button variant="destructivePrimary" leftIcon={Zap}>Danger</Button>
                        <Button variant="aiPrimary" rightIcon={ArrowRight}>Generate</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="forms">
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader><CardTitle>Checkboxes</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        ATOM — unchecked · checked · indeterminate · disabled
                      </p>
                      <div className="flex items-center gap-6">
                        <Checkbox />
                        <Checkbox defaultChecked />
                        <Checkbox checked="indeterminate" />
                        <Checkbox disabled />
                        <Checkbox disabled defaultChecked />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        SIZES — sm (14px) · md (16px) · lg (20px)
                      </p>
                      <div className="space-y-3">
                        <CheckboxItem size="sm" label="Small label" defaultChecked />
                        <CheckboxItem size="md" label="Medium label" defaultChecked />
                        <CheckboxItem size="lg" label="Large label" defaultChecked />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        WITH DESCRIPTION
                      </p>
                      <div className="space-y-3">
                        <CheckboxItem
                          label="Subscribe to newsletter"
                          description="Receive weekly product updates and announcements."
                        />
                        <CheckboxItem
                          label="Enable notifications"
                          description="Push notifications for important activity."
                          defaultChecked
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        DISABLED
                      </p>
                      <div className="space-y-3">
                        <CheckboxItem label="Disabled unchecked" disabled />
                        <CheckboxItem label="Disabled checked" disabled defaultChecked />
                        <CheckboxItem
                          label="Disabled with description"
                          description="This option is not available."
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Radio Groups</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        SIZES — sm (14px) · md (16px) · lg (20px)
                      </p>
                      <div className="flex gap-16">
                        <RadioGroup defaultValue="a">
                          <RadioItem value="a" label="Small option A" size="sm" />
                          <RadioItem value="b" label="Small option B" size="sm" />
                          <RadioItem value="c" label="Small option C" size="sm" />
                        </RadioGroup>
                        <RadioGroup defaultValue="b">
                          <RadioItem value="a" label="Medium option A" size="md" />
                          <RadioItem value="b" label="Medium option B" size="md" />
                          <RadioItem value="c" label="Medium option C" size="md" />
                        </RadioGroup>
                        <RadioGroup defaultValue="c">
                          <RadioItem value="a" label="Large option A" size="lg" />
                          <RadioItem value="b" label="Large option B" size="lg" />
                          <RadioItem value="c" label="Large option C" size="lg" />
                        </RadioGroup>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        WITH DESCRIPTIONS
                      </p>
                      <RadioGroup defaultValue="standard" className="max-w-sm">
                        <RadioItem
                          value="standard"
                          label="Standard shipping"
                          description="Delivered in 5–7 business days."
                        />
                        <RadioItem
                          value="express"
                          label="Express shipping"
                          description="Delivered in 2–3 business days."
                        />
                        <RadioItem
                          value="overnight"
                          label="Overnight shipping"
                          description="Delivered next business day by noon."
                        />
                      </RadioGroup>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        DISABLED
                      </p>
                      <RadioGroup defaultValue="a" className="max-w-sm">
                        <RadioItem value="a" label="Active option" description="This option is available." />
                        <RadioItem value="b" label="Disabled option" description="This option is not available." disabled />
                        <RadioItem value="c" label="Another active option" />
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Number Input</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-6 max-w-xs">
                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        DEFAULT
                      </p>
                      <NumberInput defaultValue={0} />
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        WITH MIN / MAX / STEP
                      </p>
                      <NumberInput defaultValue={50} min={0} max={100} step={5} />
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        SIZES — sm · md · lg
                      </p>
                      <div className="flex flex-col gap-3">
                        <NumberInput size="sm" defaultValue={0} placeholder="Small" />
                        <NumberInput size="md" defaultValue={0} placeholder="Medium" />
                        <NumberInput size="lg" defaultValue={0} placeholder="Large" />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        STATUS
                      </p>
                      <div className="flex flex-col gap-3">
                        <NumberInput status="error" defaultValue={42} />
                        <NumberInput status="success" defaultValue={42} />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        DISABLED
                      </p>
                      <NumberInput disabled defaultValue={42} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Switches</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        ATOM — unchecked · checked
                      </p>
                      <div className="flex items-center gap-6">
                        <Switch />
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        WITH LABEL + HINT
                      </p>
                      <div className="space-y-4">
                        <Switch label="Enable notifications" hint="You'll receive email alerts." />
                        <Switch label="Dark mode" defaultChecked />
                        <Switch label="Required field" required />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        VALIDATION — error · success
                      </p>
                      <div className="space-y-4">
                        <Switch
                          label="Terms & conditions"
                          status="error"
                          message="You must accept the terms to continue."
                        />
                        <Switch
                          label="Email verified"
                          defaultChecked
                          status="success"
                          message="Your email address is verified."
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        STATES — disabled · readonly
                      </p>
                      <div className="space-y-4">
                        <Switch label="Disabled unchecked" disabled />
                        <Switch label="Disabled checked" disabled defaultChecked />
                        <Switch label="Read-only unchecked" readOnly />
                        <Switch label="Read-only checked" readOnly defaultChecked />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        LABEL PLACEMENT — start
                      </p>
                      <div className="space-y-4">
                        <Switch label="Label on the left" labelPlacement="start" />
                        <Switch label="Label on the left, checked" labelPlacement="start" defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Date Pickers</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        UNCONTROLLED
                      </p>
                      <div className="w-64">
                        <DatePicker />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        WITH YEAR PICKER
                      </p>
                      <div className="w-64">
                        <DatePicker showYearPicker />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        SIZES — sm · md · lg
                      </p>
                      <div className="flex flex-col gap-3 w-64">
                        <DatePicker size="sm" placeholder="Small (32px)" />
                        <DatePicker size="md" placeholder="Medium (40px)" />
                        <DatePicker size="lg" placeholder="Large (48px)" />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        STATUS
                      </p>
                      <div className="flex flex-col gap-3 w-64">
                        <DatePicker status="error" placeholder="Error state" />
                        <DatePicker status="success" placeholder="Success state" />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        DISABLED
                      </p>
                      <div className="w-64">
                        <DatePicker disabled placeholder="Disabled" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Date-Time Input</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        COLUMNS LAYOUT (DEFAULT)
                      </p>
                      <DateTimeInput label="Appointment" required />
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        STACKED LAYOUT
                      </p>
                      <div className="max-w-sm">
                        <DateTimeInput label="Appointment" layout="stacked" />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        ERROR STATE
                      </p>
                      <DateTimeInput
                        label="Appointment"
                        status="error"
                        message="Please select a valid date and time."
                      />
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        SUCCESS STATE
                      </p>
                      <DateTimeInput
                        label="Appointment"
                        status="success"
                        message="Friday, January 16, 2026 11:00 AM"
                      />
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        DISABLED
                      </p>
                      <DateTimeInput label="Appointment" disabled />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="data">
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader><CardTitle>Tables</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        SORT INDICATORS — asc · desc · unsorted · plain
                      </p>
                      <Table>
                        <TableCaption>Q1 2025 Sales by Representative</TableCaption>
                        <TableHeader>
                          <TableRow>
                            <TableHead sort="asc">Name</TableHead>
                            <TableHead sort={false}>Region</TableHead>
                            <TableHead sort="desc">Revenue</TableHead>
                            <TableHead sort={false}>Deals</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Alice Johnson</TableCell>
                            <TableCell>North America</TableCell>
                            <TableCell>$84,200</TableCell>
                            <TableCell>14</TableCell>
                            <TableCell>Active</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Ben Carter</TableCell>
                            <TableCell>Europe</TableCell>
                            <TableCell>$71,500</TableCell>
                            <TableCell>11</TableCell>
                            <TableCell>Active</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Clara Nguyen</TableCell>
                            <TableCell>Asia Pacific</TableCell>
                            <TableCell>$63,900</TableCell>
                            <TableCell>9</TableCell>
                            <TableCell>On leave</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>David Park</TableCell>
                            <TableCell>North America</TableCell>
                            <TableCell>$58,400</TableCell>
                            <TableCell>8</TableCell>
                            <TableCell>Active</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Eva Schmidt</TableCell>
                            <TableCell>Europe</TableCell>
                            <TableCell>$47,100</TableCell>
                            <TableCell>7</TableCell>
                            <TableCell>Active</TableCell>
                          </TableRow>
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell>$325,100</TableCell>
                            <TableCell>49</TableCell>
                            <TableCell />
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Avatars</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Sizes */}
                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        SIZES — xxSmall · xSmall · small · medium · large · xLarge · xxLarge
                      </p>
                      <div className="flex items-end gap-4">
                        {(["xxSmall", "xSmall", "small", "medium", "large", "xLarge", "xxLarge"] as const).map((size) => (
                          <div key={size} className="flex flex-col items-center gap-2">
                            <Avatar size={size} initials="SR" />
                            <span className="text-xs font-mono" style={{ color: "var(--color-text-placeholder)" }}>{size}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Content types */}
                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        CONTENT — image · text initials · icon
                      </p>
                      <div className="flex items-center gap-4">
                        <Avatar size="large" src="https://i.pravatar.cc/150?img=47" alt="Sara R." initials="SR" />
                        <Avatar size="large" initials="SR" />
                        <Avatar size="large" icon={User} />
                      </div>
                    </div>

                    {/* Shapes */}
                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        SHAPES — circle · rectangle
                      </p>
                      <div className="flex items-center gap-4">
                        <Avatar size="large" shape="circle" initials="SR" />
                        <Avatar size="large" shape="rectangle" initials="SR" />
                        <Avatar size="large" shape="circle" icon={Building2} />
                        <Avatar size="large" shape="rectangle" icon={Building2} />
                      </div>
                    </div>

                    {/* Border */}
                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        SHOW BORDER
                      </p>
                      <div className="flex items-center gap-4">
                        <Avatar size="large" initials="SR" showBorder />
                        <Avatar size="large" icon={User} showBorder />
                        <Avatar size="large" src="https://i.pravatar.cc/150?img=47" alt="Sara R." initials="SR" showBorder />
                      </div>
                    </div>

                    {/* Inverse */}
                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        INVERSE (blue background)
                      </p>
                      <div className="flex items-center gap-4">
                        <Avatar size="large" initials="SR" inverse />
                        <Avatar size="large" icon={User} inverse />
                        <Avatar size="large" shape="rectangle" initials="JD" inverse />
                        <Avatar size="large" initials="SR" inverse showBorder />
                      </div>
                    </div>

                    {/* All sizes inverse */}
                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        ALL SIZES — inverse
                      </p>
                      <div className="flex items-end gap-4">
                        {(["xxSmall", "xSmall", "small", "medium", "large", "xLarge", "xxLarge"] as const).map((size) => (
                          <Avatar key={size} size={size} initials="SR" inverse />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Calendars</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        SINGLE SELECT
                      </p>
                      <Calendar mode="single" />
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        WITH YEAR PICKER
                      </p>
                      <Calendar mode="single" showYearPicker />
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        RANGE SELECT
                      </p>
                      <Calendar mode="range" />
                    </div>

                    <div>
                      <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                        WITH DISABLED DATES
                      </p>
                      <Calendar
                        mode="single"
                        disabled={{ dayOfWeek: [0, 6] }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </AppShell>
    </Tabs>
  );
}

function ColorSwatch({
  label,
  hex,
  border = false,
}: {
  label: string;
  hex: string;
  border?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div
        className="h-12 rounded"
        style={{
          backgroundColor: hex,
          border: border ? "1px solid var(--border)" : undefined,
        }}
      />
      <p className="text-xs font-medium" style={{ color: "var(--foreground)" }}>
        {label}
      </p>
      <p className="text-xs font-mono" style={{ color: "var(--color-text-placeholder)" }}>
        {hex}
      </p>
    </div>
  );
}
