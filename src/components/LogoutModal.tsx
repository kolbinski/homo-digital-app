import { View, Text, Modal, TouchableOpacity } from 'react-native'

interface Props {
  visible: boolean
  onClose: () => void
  onConfirm: () => void
}

export function LogoutModal({ visible, onClose, onConfirm }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, width: '80%', gap: 16 }}
        >
          <Text style={{ fontSize: 17, fontWeight: '600', color: '#1a1a1a', textAlign: 'center' }}>
            Logout
          </Text>
          <Text style={{ fontSize: 15, color: '#6b7280', textAlign: 'center' }}>
            Are you sure you want to logout?
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={onClose}
              style={{ flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center' }}
            >
              <Text style={{ color: '#1a1a1a', fontWeight: '500' }}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: '#ef4444', alignItems: 'center' }}
            >
              <Text style={{ color: '#fff', fontWeight: '500' }}>Yes, logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  )
}
