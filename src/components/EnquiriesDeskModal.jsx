import React from "react";
import { X, CheckCircle2, Clock, Trash2, Phone, Mail, FileText, User } from "lucide-react";

export default function EnquiriesDeskModal({ isOpen, onClose, enquiries, onClearAll, onDeleteOne }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-gray-100 relative overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#063321] to-[#0a482e] text-white">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">GSP Enquiries & Submissions Desk</h3>
              <span className="bg-amber-400 text-gray-950 text-xs font-black px-2 py-0.5 rounded-full">
                {enquiries.length} Record{enquiries.length !== 1 ? "s" : ""}
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 mt-1">
              Live record of all Share Enquiries, Callbacks, and Applications saved in system.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {enquiries.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-40 text-emerald-800" />
              <p className="text-sm font-semibold text-gray-600">No submissions recorded yet.</p>
              <p className="text-xs text-gray-400 mt-1">
                Submit an enquiry on any Share card, the Callback form, or Register to see live records here!
              </p>
            </div>
          ) : (
            enquiries.map((item, idx) => (
              <div 
                key={item.id || idx}
                className="bg-gray-50 rounded-2xl p-4 border border-gray-200/90 shadow-xs relative hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      item.type === "sell" 
                        ? "bg-rose-100 text-rose-800" 
                        : item.type === "callback" 
                        ? "bg-blue-100 text-blue-800"
                        : item.type === "account"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {item.type ? item.type.toUpperCase() : "BUY ENQUIRY"}
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      {item.title || item.share || "Share Enquiry"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time || "Just now"}
                    </span>
                    <button 
                      onClick={() => onDeleteOne(idx)}
                      className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 mt-3 pt-2 border-t border-gray-200">
                  <div>
                    <span className="text-gray-400">Name:</span> <strong className="text-gray-800">{item.fullName || item.name || "N/A"}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400">Mobile:</span> <strong className="text-gray-800">{item.mobile || "N/A"}</strong>
                  </div>
                  {item.email && (
                    <div>
                      <span className="text-gray-400">Email:</span> <span className="text-gray-800">{item.email}</span>
                    </div>
                  )}
                  {item.quantity && (
                    <div>
                      <span className="text-gray-400">Quantity:</span> <strong className="text-gray-800">{item.quantity} shares</strong>
                    </div>
                  )}
                  {item.service && (
                    <div>
                      <span className="text-gray-400">Service:</span> <span className="text-gray-800">{item.service}</span>
                    </div>
                  )}
                  {item.pan && (
                    <div>
                      <span className="text-gray-400">PAN Card:</span> <span className="text-gray-800 font-mono">{item.pan}</span>
                    </div>
                  )}
                </div>

                {item.message && (
                  <div className="mt-2 text-xs bg-white p-2.5 rounded-xl border border-gray-200 text-gray-600">
                    <span className="text-gray-400">Note:</span> “{item.message}”
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-800 font-semibold pt-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Stored in Database & Escrow Dispatch Desk
                  </span>
                  <span className="text-amber-600 font-bold">Status: Pending Verification</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          {enquiries.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All History</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-5 py-2 bg-[#093523] text-white rounded-xl text-xs font-bold hover:bg-[#062518] transition-colors"
          >
            Close Desk
          </button>
        </div>

      </div>
    </div>
  );
}
