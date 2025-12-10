/**
 * UmlDiagrams.tsx - UML диаграммы проекта SIMS
 * 
 * Страница с UML диаграммами системы для скачивания
 */

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";

const UmlDiagrams = () => {
  const diagramRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const downloadAsImage = async () => {
    if (!diagramRef.current) return;
    
    const canvas = await html2canvas(diagramRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
    });
    
    const link = document.createElement("a");
    link.download = "SIMS_UML_Diagrams.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button onClick={downloadAsImage} className="gap-2">
            <Download className="h-4 w-4" />
            Download as PNG
          </Button>
        </div>

        <div ref={diagramRef} className="space-y-8 bg-white p-8 rounded-lg">
          {/* Title */}
          <div className="text-center border-b-2 border-gray-300 pb-6">
            <h1 className="text-3xl font-bold text-gray-900">SIMS - Simple Inventory Management System</h1>
            <p className="text-gray-600 mt-2">UML Diagrams / UML Диаграммы</p>
          </div>

          {/* Use Case Diagram */}
          <Card className="border-2 border-gray-300">
            <CardHeader className="bg-gray-100">
              <CardTitle className="text-gray-900">1. Use Case Diagram / Диаграмма вариантов использования</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <svg viewBox="0 0 800 500" className="w-full h-auto">
                {/* System boundary */}
                <rect x="150" y="20" width="500" height="460" fill="none" stroke="#333" strokeWidth="2" strokeDasharray="5,5" rx="10"/>
                <text x="400" y="50" textAnchor="middle" className="font-bold" fill="#333">SIMS System</text>
                
                {/* Actors */}
                {/* Admin */}
                <circle cx="60" cy="100" r="20" fill="none" stroke="#2563eb" strokeWidth="2"/>
                <line x1="60" y1="120" x2="60" y2="170" stroke="#2563eb" strokeWidth="2"/>
                <line x1="60" y1="140" x2="30" y2="160" stroke="#2563eb" strokeWidth="2"/>
                <line x1="60" y1="140" x2="90" y2="160" stroke="#2563eb" strokeWidth="2"/>
                <line x1="60" y1="170" x2="30" y2="200" stroke="#2563eb" strokeWidth="2"/>
                <line x1="60" y1="170" x2="90" y2="200" stroke="#2563eb" strokeWidth="2"/>
                <text x="60" y="220" textAnchor="middle" fill="#2563eb" fontWeight="bold">Admin</text>
                
                {/* User */}
                <circle cx="60" cy="300" r="20" fill="none" stroke="#16a34a" strokeWidth="2"/>
                <line x1="60" y1="320" x2="60" y2="370" stroke="#16a34a" strokeWidth="2"/>
                <line x1="60" y1="340" x2="30" y2="360" stroke="#16a34a" strokeWidth="2"/>
                <line x1="60" y1="340" x2="90" y2="360" stroke="#16a34a" strokeWidth="2"/>
                <line x1="60" y1="370" x2="30" y2="400" stroke="#16a34a" strokeWidth="2"/>
                <line x1="60" y1="370" x2="90" y2="400" stroke="#16a34a" strokeWidth="2"/>
                <text x="60" y="420" textAnchor="middle" fill="#16a34a" fontWeight="bold">User</text>
                
                {/* Viewer */}
                <circle cx="740" cy="200" r="20" fill="none" stroke="#9333ea" strokeWidth="2"/>
                <line x1="740" y1="220" x2="740" y2="270" stroke="#9333ea" strokeWidth="2"/>
                <line x1="740" y1="240" x2="710" y2="260" stroke="#9333ea" strokeWidth="2"/>
                <line x1="740" y1="240" x2="770" y2="260" stroke="#9333ea" strokeWidth="2"/>
                <line x1="740" y1="270" x2="710" y2="300" stroke="#9333ea" strokeWidth="2"/>
                <line x1="740" y1="270" x2="770" y2="300" stroke="#9333ea" strokeWidth="2"/>
                <text x="740" y="320" textAnchor="middle" fill="#9333ea" fontWeight="bold">Viewer</text>
                
                {/* Use Cases */}
                <ellipse cx="400" cy="100" rx="100" ry="30" fill="#dbeafe" stroke="#2563eb" strokeWidth="2"/>
                <text x="400" y="105" textAnchor="middle" fill="#1e40af">Login / Вход</text>
                
                <ellipse cx="300" cy="180" rx="100" ry="30" fill="#dbeafe" stroke="#2563eb" strokeWidth="2"/>
                <text x="300" y="185" textAnchor="middle" fill="#1e40af">Add Product</text>
                
                <ellipse cx="500" cy="180" rx="100" ry="30" fill="#dbeafe" stroke="#2563eb" strokeWidth="2"/>
                <text x="500" y="185" textAnchor="middle" fill="#1e40af">Edit Product</text>
                
                <ellipse cx="300" cy="260" rx="100" ry="30" fill="#dbeafe" stroke="#2563eb" strokeWidth="2"/>
                <text x="300" y="265" textAnchor="middle" fill="#1e40af">Delete Product</text>
                
                <ellipse cx="500" cy="260" rx="100" ry="30" fill="#dcfce7" stroke="#16a34a" strokeWidth="2"/>
                <text x="500" y="265" textAnchor="middle" fill="#166534">View Products</text>
                
                <ellipse cx="300" cy="340" rx="100" ry="30" fill="#fee2e2" stroke="#dc2626" strokeWidth="2"/>
                <text x="300" y="345" textAnchor="middle" fill="#991b1b">View Audit Log</text>
                
                <ellipse cx="500" cy="340" rx="100" ry="30" fill="#fee2e2" stroke="#dc2626" strokeWidth="2"/>
                <text x="500" y="345" textAnchor="middle" fill="#991b1b">Export Reports</text>
                
                <ellipse cx="400" cy="420" rx="100" ry="30" fill="#dcfce7" stroke="#16a34a" strokeWidth="2"/>
                <text x="400" y="425" textAnchor="middle" fill="#166534">View Charts</text>
                
                {/* Connections */}
                <line x1="90" y1="100" x2="300" y2="100" stroke="#2563eb" strokeWidth="1"/>
                <line x1="90" y1="150" x2="200" y2="180" stroke="#2563eb" strokeWidth="1"/>
                <line x1="90" y1="150" x2="400" y2="180" stroke="#2563eb" strokeWidth="1"/>
                <line x1="90" y1="180" x2="200" y2="260" stroke="#2563eb" strokeWidth="1"/>
                <line x1="90" y1="180" x2="200" y2="340" stroke="#dc2626" strokeWidth="1"/>
                <line x1="90" y1="180" x2="400" y2="340" stroke="#dc2626" strokeWidth="1"/>
                
                <line x1="90" y1="300" x2="200" y2="180" stroke="#16a34a" strokeWidth="1"/>
                <line x1="90" y1="300" x2="400" y2="180" stroke="#16a34a" strokeWidth="1"/>
                <line x1="90" y1="340" x2="200" y2="260" stroke="#16a34a" strokeWidth="1"/>
                <line x1="90" y1="380" x2="400" y2="260" stroke="#16a34a" strokeWidth="1"/>
                <line x1="90" y1="380" x2="300" y2="420" stroke="#16a34a" strokeWidth="1"/>
                
                <line x1="650" y1="200" x2="600" y2="260" stroke="#9333ea" strokeWidth="1"/>
                <line x1="650" y1="250" x2="500" y2="420" stroke="#9333ea" strokeWidth="1"/>
              </svg>
            </CardContent>
          </Card>

          {/* Class Diagram */}
          <Card className="border-2 border-gray-300">
            <CardHeader className="bg-gray-100">
              <CardTitle className="text-gray-900">2. Class Diagram / Диаграмма классов</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <svg viewBox="0 0 900 600" className="w-full h-auto">
                {/* Product Class */}
                <rect x="50" y="50" width="200" height="180" fill="#dbeafe" stroke="#2563eb" strokeWidth="2"/>
                <rect x="50" y="50" width="200" height="35" fill="#2563eb"/>
                <text x="150" y="75" textAnchor="middle" fill="white" fontWeight="bold">Product</text>
                <line x1="50" y1="85" x2="250" y2="85" stroke="#2563eb" strokeWidth="1"/>
                <text x="60" y="105" fill="#1e40af" fontSize="12">+ id: UUID</text>
                <text x="60" y="125" fill="#1e40af" fontSize="12">+ name: string</text>
                <text x="60" y="145" fill="#1e40af" fontSize="12">+ category: string</text>
                <text x="60" y="165" fill="#1e40af" fontSize="12">+ quantity: number</text>
                <text x="60" y="185" fill="#1e40af" fontSize="12">+ price: number</text>
                <text x="60" y="205" fill="#1e40af" fontSize="12">+ low_stock_threshold: number</text>
                <text x="60" y="225" fill="#1e40af" fontSize="12">+ created_at: timestamp</text>
                
                {/* User Class */}
                <rect x="350" y="50" width="200" height="150" fill="#dcfce7" stroke="#16a34a" strokeWidth="2"/>
                <rect x="350" y="50" width="200" height="35" fill="#16a34a"/>
                <text x="450" y="75" textAnchor="middle" fill="white" fontWeight="bold">User</text>
                <line x1="350" y1="85" x2="550" y2="85" stroke="#16a34a" strokeWidth="1"/>
                <text x="360" y="105" fill="#166534" fontSize="12">+ id: UUID</text>
                <text x="360" y="125" fill="#166534" fontSize="12">+ email: string</text>
                <text x="360" y="145" fill="#166534" fontSize="12">+ created_at: timestamp</text>
                <line x1="350" y1="155" x2="550" y2="155" stroke="#16a34a" strokeWidth="1"/>
                <text x="360" y="175" fill="#166534" fontSize="12">+ signIn()</text>
                <text x="360" y="195" fill="#166534" fontSize="12">+ signOut()</text>
                
                {/* UserRole Class */}
                <rect x="650" y="50" width="200" height="130" fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
                <rect x="650" y="50" width="200" height="35" fill="#d97706"/>
                <text x="750" y="75" textAnchor="middle" fill="white" fontWeight="bold">UserRole</text>
                <line x1="650" y1="85" x2="850" y2="85" stroke="#d97706" strokeWidth="1"/>
                <text x="660" y="105" fill="#92400e" fontSize="12">+ id: UUID</text>
                <text x="660" y="125" fill="#92400e" fontSize="12">+ user_id: UUID</text>
                <text x="660" y="145" fill="#92400e" fontSize="12">+ role: app_role</text>
                <text x="660" y="165" fill="#92400e" fontSize="12">+ created_at: timestamp</text>
                
                {/* AuditLog Class */}
                <rect x="50" y="300" width="200" height="180" fill="#fee2e2" stroke="#dc2626" strokeWidth="2"/>
                <rect x="50" y="300" width="200" height="35" fill="#dc2626"/>
                <text x="150" y="325" textAnchor="middle" fill="white" fontWeight="bold">AuditLog</text>
                <line x1="50" y1="335" x2="250" y2="335" stroke="#dc2626" strokeWidth="1"/>
                <text x="60" y="355" fill="#991b1b" fontSize="12">+ id: UUID</text>
                <text x="60" y="375" fill="#991b1b" fontSize="12">+ action: string</text>
                <text x="60" y="395" fill="#991b1b" fontSize="12">+ table_name: string</text>
                <text x="60" y="415" fill="#991b1b" fontSize="12">+ record_id: UUID</text>
                <text x="60" y="435" fill="#991b1b" fontSize="12">+ old_data: JSON</text>
                <text x="60" y="455" fill="#991b1b" fontSize="12">+ new_data: JSON</text>
                <text x="60" y="475" fill="#991b1b" fontSize="12">+ performed_by: UUID</text>
                
                {/* Profile Class */}
                <rect x="350" y="300" width="200" height="130" fill="#f3e8ff" stroke="#9333ea" strokeWidth="2"/>
                <rect x="350" y="300" width="200" height="35" fill="#9333ea"/>
                <text x="450" y="325" textAnchor="middle" fill="white" fontWeight="bold">Profile</text>
                <line x1="350" y1="335" x2="550" y2="335" stroke="#9333ea" strokeWidth="1"/>
                <text x="360" y="355" fill="#6b21a8" fontSize="12">+ id: UUID</text>
                <text x="360" y="375" fill="#6b21a8" fontSize="12">+ user_id: UUID</text>
                <text x="360" y="395" fill="#6b21a8" fontSize="12">+ username: string</text>
                <text x="360" y="415" fill="#6b21a8" fontSize="12">+ created_at: timestamp</text>
                
                {/* Enum */}
                <rect x="650" y="250" width="200" height="100" fill="#e5e7eb" stroke="#6b7280" strokeWidth="2"/>
                <rect x="650" y="250" width="200" height="35" fill="#6b7280"/>
                <text x="750" y="275" textAnchor="middle" fill="white" fontWeight="bold">«enum» app_role</text>
                <line x1="650" y1="285" x2="850" y2="285" stroke="#6b7280" strokeWidth="1"/>
                <text x="660" y="305" fill="#374151" fontSize="12">admin</text>
                <text x="660" y="325" fill="#374151" fontSize="12">user</text>
                <text x="660" y="345" fill="#374151" fontSize="12">viewer</text>
                
                {/* Relationships */}
                <line x1="550" y1="100" x2="650" y2="100" stroke="#333" strokeWidth="2"/>
                <polygon points="645,95 655,100 645,105" fill="#333"/>
                <text x="600" y="90" textAnchor="middle" fill="#333" fontSize="11">1..1</text>
                
                <line x1="450" y1="200" x2="450" y2="300" stroke="#333" strokeWidth="2"/>
                <polygon points="445,295 450,305 455,295" fill="#333"/>
                <text x="470" y="250" fill="#333" fontSize="11">1..1</text>
                
                <line x1="250" y1="230" x2="250" y2="300" stroke="#333" strokeWidth="2" strokeDasharray="5,5"/>
                <text x="270" y="265" fill="#333" fontSize="11">tracks</text>
                
                <line x1="750" y1="180" x2="750" y2="250" stroke="#333" strokeWidth="2" strokeDasharray="5,5"/>
              </svg>
            </CardContent>
          </Card>

          {/* Database Schema */}
          <Card className="border-2 border-gray-300">
            <CardHeader className="bg-gray-100">
              <CardTitle className="text-gray-900">3. Database Schema / Схема базы данных</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <svg viewBox="0 0 900 450" className="w-full h-auto">
                {/* Products Table */}
                <rect x="50" y="50" width="220" height="200" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" rx="5"/>
                <rect x="50" y="50" width="220" height="30" fill="#2563eb" rx="5"/>
                <text x="160" y="72" textAnchor="middle" fill="white" fontWeight="bold">products</text>
                <text x="60" y="100" fill="#1e40af" fontSize="11">🔑 id UUID PRIMARY KEY</text>
                <text x="60" y="120" fill="#1e40af" fontSize="11">📝 name VARCHAR NOT NULL</text>
                <text x="60" y="140" fill="#1e40af" fontSize="11">📁 category VARCHAR</text>
                <text x="60" y="160" fill="#1e40af" fontSize="11">🔢 quantity INTEGER</text>
                <text x="60" y="180" fill="#1e40af" fontSize="11">💰 price DECIMAL</text>
                <text x="60" y="200" fill="#1e40af" fontSize="11">⚠️ low_stock_threshold INTEGER</text>
                <text x="60" y="220" fill="#1e40af" fontSize="11">📅 created_at TIMESTAMPTZ</text>
                <text x="60" y="240" fill="#1e40af" fontSize="11">📅 updated_at TIMESTAMPTZ</text>
                
                {/* User Roles Table */}
                <rect x="340" y="50" width="220" height="140" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" rx="5"/>
                <rect x="340" y="50" width="220" height="30" fill="#16a34a" rx="5"/>
                <text x="450" y="72" textAnchor="middle" fill="white" fontWeight="bold">user_roles</text>
                <text x="350" y="100" fill="#166534" fontSize="11">🔑 id UUID PRIMARY KEY</text>
                <text x="350" y="120" fill="#166534" fontSize="11">🔗 user_id UUID → auth.users</text>
                <text x="350" y="140" fill="#166534" fontSize="11">👤 role app_role</text>
                <text x="350" y="160" fill="#166534" fontSize="11">📅 created_at TIMESTAMPTZ</text>
                <text x="350" y="180" fill="#166534" fontSize="11">📅 updated_at TIMESTAMPTZ</text>
                
                {/* Audit Log Table */}
                <rect x="630" y="50" width="220" height="180" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" rx="5"/>
                <rect x="630" y="50" width="220" height="30" fill="#dc2626" rx="5"/>
                <text x="740" y="72" textAnchor="middle" fill="white" fontWeight="bold">audit_log</text>
                <text x="640" y="100" fill="#991b1b" fontSize="11">🔑 id UUID PRIMARY KEY</text>
                <text x="640" y="120" fill="#991b1b" fontSize="11">⚡ action VARCHAR</text>
                <text x="640" y="140" fill="#991b1b" fontSize="11">📋 table_name VARCHAR</text>
                <text x="640" y="160" fill="#991b1b" fontSize="11">🔗 record_id UUID</text>
                <text x="640" y="180" fill="#991b1b" fontSize="11">📦 old_data JSONB</text>
                <text x="640" y="200" fill="#991b1b" fontSize="11">📦 new_data JSONB</text>
                <text x="640" y="220" fill="#991b1b" fontSize="11">👤 performed_by UUID</text>
                
                {/* Profiles Table */}
                <rect x="340" y="260" width="220" height="140" fill="#f3e8ff" stroke="#9333ea" strokeWidth="2" rx="5"/>
                <rect x="340" y="260" width="220" height="30" fill="#9333ea" rx="5"/>
                <text x="450" y="282" textAnchor="middle" fill="white" fontWeight="bold">profiles</text>
                <text x="350" y="310" fill="#6b21a8" fontSize="11">🔑 id UUID PRIMARY KEY</text>
                <text x="350" y="330" fill="#6b21a8" fontSize="11">🔗 user_id UUID → auth.users</text>
                <text x="350" y="350" fill="#6b21a8" fontSize="11">👤 username VARCHAR</text>
                <text x="350" y="370" fill="#6b21a8" fontSize="11">📅 created_at TIMESTAMPTZ</text>
                <text x="350" y="390" fill="#6b21a8" fontSize="11">📅 updated_at TIMESTAMPTZ</text>
                
                {/* Relationships */}
                <path d="M270 150 L340 120" stroke="#333" strokeWidth="2" fill="none" markerEnd="url(#arrow)"/>
                <path d="M560 120 L630 120" stroke="#333" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
                <path d="M450 190 L450 260" stroke="#333" strokeWidth="2" fill="none"/>
                
                {/* Legend */}
                <rect x="50" y="320" width="200" height="100" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1" rx="5"/>
                <text x="60" y="345" fill="#374151" fontWeight="bold" fontSize="12">Legend / Легенда:</text>
                <text x="60" y="365" fill="#374151" fontSize="11">🔑 Primary Key</text>
                <text x="60" y="385" fill="#374151" fontSize="11">🔗 Foreign Key</text>
                <text x="60" y="405" fill="#374151" fontSize="11">→ References</text>
              </svg>
            </CardContent>
          </Card>

          {/* Component Diagram */}
          <Card className="border-2 border-gray-300">
            <CardHeader className="bg-gray-100">
              <CardTitle className="text-gray-900">4. Component Diagram / Диаграмма компонентов</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <svg viewBox="0 0 900 400" className="w-full h-auto">
                {/* Frontend Layer */}
                <rect x="50" y="30" width="800" height="130" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" rx="10"/>
                <text x="450" y="55" textAnchor="middle" fill="#1d4ed8" fontWeight="bold" fontSize="14">Frontend (React + TypeScript)</text>
                
                <rect x="70" y="70" width="120" height="70" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" rx="5"/>
                <text x="130" y="110" textAnchor="middle" fill="#1e40af" fontSize="11">Dashboard</text>
                
                <rect x="210" y="70" width="120" height="70" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" rx="5"/>
                <text x="270" y="110" textAnchor="middle" fill="#1e40af" fontSize="11">ProductTable</text>
                
                <rect x="350" y="70" width="120" height="70" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" rx="5"/>
                <text x="410" y="110" textAnchor="middle" fill="#1e40af" fontSize="11">Auth</text>
                
                <rect x="490" y="70" width="120" height="70" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" rx="5"/>
                <text x="550" y="110" textAnchor="middle" fill="#1e40af" fontSize="11">Reports</text>
                
                <rect x="630" y="70" width="120" height="70" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" rx="5"/>
                <text x="690" y="110" textAnchor="middle" fill="#1e40af" fontSize="11">AuditLog</text>
                
                {/* Context Layer */}
                <rect x="50" y="180" width="380" height="80" fill="#fef3c7" stroke="#d97706" strokeWidth="2" rx="10"/>
                <text x="240" y="205" textAnchor="middle" fill="#92400e" fontWeight="bold" fontSize="14">Contexts</text>
                
                <rect x="70" y="220" width="100" height="30" fill="#fde68a" stroke="#d97706" strokeWidth="1" rx="3"/>
                <text x="120" y="240" textAnchor="middle" fill="#92400e" fontSize="10">AuthContext</text>
                
                <rect x="190" y="220" width="100" height="30" fill="#fde68a" stroke="#d97706" strokeWidth="1" rx="3"/>
                <text x="240" y="240" textAnchor="middle" fill="#92400e" fontSize="10">LanguageContext</text>
                
                <rect x="310" y="220" width="100" height="30" fill="#fde68a" stroke="#d97706" strokeWidth="1" rx="3"/>
                <text x="360" y="240" textAnchor="middle" fill="#92400e" fontSize="10">ThemeProvider</text>
                
                {/* Utils Layer */}
                <rect x="470" y="180" width="380" height="80" fill="#dcfce7" stroke="#16a34a" strokeWidth="2" rx="10"/>
                <text x="660" y="205" textAnchor="middle" fill="#166534" fontWeight="bold" fontSize="14">Utilities</text>
                
                <rect x="490" y="220" width="100" height="30" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1" rx="3"/>
                <text x="540" y="240" textAnchor="middle" fill="#166534" fontSize="10">csvExport</text>
                
                <rect x="610" y="220" width="100" height="30" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1" rx="3"/>
                <text x="660" y="240" textAnchor="middle" fill="#166534" fontSize="10">exportUtils</text>
                
                <rect x="730" y="220" width="100" height="30" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1" rx="3"/>
                <text x="780" y="240" textAnchor="middle" fill="#166534" fontSize="10">translations</text>
                
                {/* Backend Layer */}
                <rect x="50" y="290" width="800" height="90" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" rx="10"/>
                <text x="450" y="315" textAnchor="middle" fill="#991b1b" fontWeight="bold" fontSize="14">Backend (Supabase / PostgreSQL)</text>
                
                <rect x="100" y="330" width="130" height="35" fill="#fecaca" stroke="#dc2626" strokeWidth="1" rx="3"/>
                <text x="165" y="353" textAnchor="middle" fill="#991b1b" fontSize="11">Authentication</text>
                
                <rect x="260" y="330" width="130" height="35" fill="#fecaca" stroke="#dc2626" strokeWidth="1" rx="3"/>
                <text x="325" y="353" textAnchor="middle" fill="#991b1b" fontSize="11">Database (RLS)</text>
                
                <rect x="420" y="330" width="130" height="35" fill="#fecaca" stroke="#dc2626" strokeWidth="1" rx="3"/>
                <text x="485" y="353" textAnchor="middle" fill="#991b1b" fontSize="11">Triggers</text>
                
                <rect x="580" y="330" width="130" height="35" fill="#fecaca" stroke="#dc2626" strokeWidth="1" rx="3"/>
                <text x="645" y="353" textAnchor="middle" fill="#991b1b" fontSize="11">Functions</text>
                
                {/* Arrows */}
                <line x1="240" y1="160" x2="240" y2="180" stroke="#333" strokeWidth="2"/>
                <line x1="660" y1="160" x2="660" y2="180" stroke="#333" strokeWidth="2"/>
                <line x1="450" y1="260" x2="450" y2="290" stroke="#333" strokeWidth="2"/>
              </svg>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-gray-500 pt-6 border-t-2 border-gray-300">
            <p>SIMS - Simple Inventory Management System</p>
            <p>University Project © 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UmlDiagrams;
