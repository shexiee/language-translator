import streamlit as st
import pandas as pd
import json
import os
from translate import Translator
from googletrans import Translator as GoogleTranslator
import time

# List of language codes and names
LANGUAGES = {
    'af': 'Afrikaans', 'ar': 'Arabic', 'bg': 'Bulgarian', 'bn': 'Bengali',
    'ca': 'Catalan', 'cs': 'Czech', 'cy': 'Welsh', 'da': 'Danish', 'de': 'German',
    'el': 'Greek', 'en': 'English', 'es': 'Spanish', 'et': 'Estonian',
    'fa': 'Persian', 'fi': 'Finnish', 'fr': 'French', 'gu': 'Gujarati',
    'he': 'Hebrew', 'hi': 'Hindi', 'hr': 'Croatian', 'hu': 'Hungarian',
    'id': 'Indonesian', 'it': 'Italian', 'ja': 'Japanese', 'kn': 'Kannada',
    'ko': 'Korean', 'lt': 'Lithuanian', 'lv': 'Latvian', 'mk': 'Macedonian',
    'ml': 'Malayalam', 'mr': 'Marathi', 'ne': 'Nepali', 'nl': 'Dutch',
    'no': 'Norwegian', 'pa': 'Punjabi', 'pl': 'Polish', 'pt': 'Portuguese',
    'ro': 'Romanian', 'ru': 'Russian', 'sk': 'Slovak', 'sl': 'Slovenian',
    'sq': 'Albanian', 'sv': 'Swedish', 'ta': 'Tamil', 'te': 'Telugu',
    'th': 'Thai', 'tr': 'Turkish', 'uk': 'Ukrainian', 'ur': 'Urdu',
    'vi': 'Vietnamese', 'zh-cn': 'Chinese (Simplified)', 'zh-tw': 'Chinese (Traditional)'
}

def get_language_code(language_name):
    """Convert language name to language code"""
    for code, name in LANGUAGES.items():
        if name == language_name:
            return code
    return 'en'  # default to English

def translate_text(source_text, src_lang, dest_lang, api):
    """Perform translation using selected API"""
    try:
        if api == "Google Translate":
            translator = GoogleTranslator()
            result = translator.translate(source_text, src=src_lang, dest=dest_lang)
            return result.text
        else:  # MyMemory
            translator = Translator(from_lang=src_lang, to_lang=dest_lang)
            # For longer texts, break into chunks (MyMemory has character limits)
            if len(source_text) > 500:
                chunks = [source_text[i:i+500] for i in range(0, len(source_text), 500)]
                translated_chunks = []
                for chunk in chunks:
                    translated_chunks.append(translator.translate(chunk))
                return ' '.join(translated_chunks)
            else:
                return translator.translate(source_text)
    except Exception as e:
        return f"Translation Error: {str(e)}"

def save_to_history(source_lang, target_lang, source_text, translated_text, api):
    """Save current translation to history"""
    history = []
    try:
        if os.path.exists('translation_history.json'):
            with open('translation_history.json', 'r', encoding='utf-8') as f:
                history = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        pass
    
    # Add new translation to history
    history.append({
        'source_lang': source_lang,
        'target_lang': target_lang,
        'source_text': source_text,
        'translated_text': translated_text,
        'api': api,
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
    })
    
    # Save history (limit to 50 entries)
    with open('translation_history.json', 'w', encoding='utf-8') as f:
        json.dump(history[-50:], f, ensure_ascii=False, indent=2)
    
    return history

def load_history():
    """Load translation history"""
    try:
        if os.path.exists('translation_history.json'):
            with open('translation_history.json', 'r', encoding='utf-8') as f:
                return json.load(f)
        return []
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def display_history(history):
    """Display translation history as a dataframe"""
    if not history:
        st.info("No translation history available.")
        return

    # Extract data for display
    display_data = []
    for entry in history:
        # Get the first 50 characters of source and translated text
        source_preview = entry['source_text'][:50] + "..." if len(entry['source_text']) > 50 else entry['source_text']
        translated_preview = entry['translated_text'][:50] + "..." if len(entry['translated_text']) > 50 else entry['translated_text']
        
        display_data.append({
            'Timestamp': entry.get('timestamp', 'Unknown'),
            'Source Language': entry['source_lang'],
            'Target Language': entry['target_lang'],
            'Source Text': source_preview,
            'Translated Text': translated_preview,
            'API': entry['api']
        })
    
    # Display as dataframe
    df = pd.DataFrame(display_data)
    st.dataframe(df)
    
    # Option to view full translation
    if st.button("View Full Text of Selected Translation"):
        # Get index from session state
        selected_idx = st.session_state.get('selected_idx', None)
        if selected_idx is not None and 0 <= selected_idx < len(history):
            entry = history[selected_idx]
            st.text_area("Original Text", entry['source_text'], height=150)
            st.text_area("Translated Text", entry['translated_text'], height=150)

def main():
    st.set_page_config(
        page_title="Multi-API Language Translator",
        page_icon="🌐",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    st.title("🌐 Language Translator")
    st.markdown("""
    Translate text between multiple languages using Google Translate or MyMemory API.
    """)
    
    # Initialize session state for saving history viewing index
    if 'selected_idx' not in st.session_state:
        st.session_state.selected_idx = None
    
    # Sidebar for API selection and history
    with st.sidebar:
        st.header("Settings")
        api = st.selectbox("Translation API:", ["Google Translate", "MyMemory"])
        
        st.divider()
        
        st.header("Translation History")
        show_history = st.checkbox("Show Translation History")
    
    # Main layout with columns
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Source")
        source_lang = st.selectbox("Source Language:", sorted(LANGUAGES.values()), index=list(sorted(LANGUAGES.values())).index("English"))
        source_text = st.text_area("Enter text to translate:", height=250)
    
    with col2:
        st.subheader("Translation")
        target_lang = st.selectbox("Target Language:", sorted(LANGUAGES.values()), index=list(sorted(LANGUAGES.values())).index("Spanish"))
        translated_text = st.empty()
    
    # Action buttons for translation
    col_btn1, col_btn2, col_space = st.columns([1, 1, 2])
    
    with col_btn1:
        translate_btn = st.button("Translate", type="primary", use_container_width=True)
    
    with col_btn2:
        save_btn = st.button("Save to History", use_container_width=True)
    
    # Handle translation
    if translate_btn and source_text:
        with st.spinner('Translating...'):
            src_lang_code = get_language_code(source_lang)
            dest_lang_code = get_language_code(target_lang)
            result = translate_text(source_text, src_lang_code, dest_lang_code, api)
            translated_text.text_area("Translation result:", value=result, height=250)
            
            # Save translation result to session state for later saving if requested
            st.session_state.latest_translation = {
                'source_lang': source_lang,
                'target_lang': target_lang,
                'source_text': source_text,
                'translated_text': result,
                'api': api
            }
    
    # Handle saving to history
    if save_btn:
        if hasattr(st.session_state, 'latest_translation') and st.session_state.latest_translation:
            trans = st.session_state.latest_translation
            save_to_history(
                trans['source_lang'], 
                trans['target_lang'], 
                trans['source_text'], 
                trans['translated_text'], 
                trans['api']
            )
            st.success("Translation saved to history!")
        else:
            st.warning("No translation available to save. Please translate some text first.")
    
    # Display history if requested
    if show_history:
        st.divider()
        st.header("Translation History")
        history = load_history()
        
        if history:
            display_history(history)
            
            # Allow loading a historical translation
            st.subheader("Load from History")
            
            # Create options list with description
            options = [f"{h['source_lang']} → {h['target_lang']}: {h['source_text'][:30]}..." for h in history]
            selected_option = st.selectbox("Select a translation to load:", options)
            
            if st.button("Load Selected Translation"):
                selected_idx = options.index(selected_option)
                st.session_state.selected_idx = selected_idx
                
                # Load the selected translation
                selected = history[selected_idx]
                st.session_state.latest_translation = selected
                
                # Display in the main interface
                source_text = selected['source_text']
                st.session_state.source_lang = selected['source_lang']
                st.session_state.target_lang = selected['target_lang']
                st.session_state.api = selected['api']
                
                # Force a rerun to update all widgets
                st.rerun()
        else:
            st.info("No translation history available.")

if __name__ == "__main__":
    main()