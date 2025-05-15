import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import { urlHost } from '../UrlApiHostStore/ApiHostStore';

const MAJOR_CODE_MAPPING = {
  'CongNghePhanMem': 'Công Nghệ Phần Mềm',
  'MangMayTinh': 'Mạng Máy Tính',
  'TinHocTracDia': 'Tin Học Trắc Địa',
  'TinHocKinhTe': 'Tin Học Kinh Tế',
  'KhoaHocMayTinh': 'Khoa Học Máy Tính',
  'HeThongThongTinVaTriThuc': 'Hệ Thống Thông Tin Và Tri Thức'
};

export const useMajorStore = defineStore("major", () => {
  const error = ref(null);
  const majors = ref([]);
  const membersByMajor = ref([]);
  const courseIntakes = ref([]);

  // Hàm lấy headers Authorization từ localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return token
      ? {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        }
      : null;
  };

  //  Lấy danh sách Major
  const getMajor = async () => {
    try {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để thêm tài liệu!";
        return;
      }

      const response = await axios.get(
        `${urlHost}/api/Controller_MemberInfo/Get_All_majors`,
        { headers }
      );

      majors.value = response.data;
      return response.data;
    } catch (err) {
      error.value = "❌ Có lỗi xảy ra khi lấy danh sách ngành học!";
      console.error("Error fetching majors:", err);
      return null;
    }
  };

  // Lấy danh sách thành viên theo ngành
  const getMembersByMajor = async (majorName) => {
    try {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để xem thông tin!";
        return;
      }
      
      const majorCode = Object.entries(MAJOR_CODE_MAPPING)
        .find(([code, name]) => name === majorName)?.[0] || majorName;

      console.log("Converting major name to code:", { majorName, majorCode });

      const response = await axios.get(
        `${urlHost}/api/Controller_MemberInfo/Search_Member`,
        { 
          headers,
          params: {
            majorName: majorCode
          }
        }
      );

      if (response.data.status === 200) {
        // Lọc thành viên theo majorName và chỉ lấy những người có role là "Đoàn viên"
        const filteredMembers = response.data.data.items.filter(
          member => member.major === majorCode && member.roleName === "Đoàn viên"
        );
        console.log("Filtered members:", { 
          total: response.data.data.items.length,
          filtered: filteredMembers.length,
          majorCode,
          members: filteredMembers
        });
        membersByMajor.value = filteredMembers;
        return filteredMembers;
      } else {
        error.value = "❌ Không thể lấy danh sách thành viên!";
        return null;
      }
    } catch (err) {
      error.value = "❌ Có lỗi xảy ra khi lấy danh sách thành viên!";
      console.error("Error fetching members:", err);
      return null;
    }
  };

  // Tìm kiếm thành viên theo ngành
  const searchMembersByMajor = async (majorName, searchQuery) => {
    try {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để xem thông tin!";
        return;
      }

      const majorCode = Object.entries(MAJOR_CODE_MAPPING)
        .find(([code, name]) => name === majorName)?.[0] || majorName;

      const response = await axios.get(
        `${urlHost}/api/Controller_MemberInfo/Search_Member`,
        { 
          headers,
          params: {
            majorName: majorCode
          }
        }
      );

      if (response.data.status === 200) {
        const filteredMembers = response.data.data.items.filter(
          member => 
            member.major === majorCode && 
            member.roleName === "Đoàn viên" &&
            (member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
             member.courseIntake.toLowerCase().includes(searchQuery.toLowerCase()) ||
             member.maSV.toLowerCase().includes(searchQuery.toLowerCase()) ||
             member.email.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        membersByMajor.value = filteredMembers;
        return filteredMembers;
      } else {
        error.value = "❌ Không thể tìm kiếm thành viên!";
        return null;
      }
    } catch (err) {
      error.value = "❌ Có lỗi xảy ra khi tìm kiếm thành viên!";
      console.error("Error searching members:", err);
      return null;
    }
  };

  // Lấy danh sách khóa học
  const getCourseIntakes = async () => {
    try {
      const headers = getAuthHeaders();

      if (!headers) {
        error.value = "🔒 Bạn cần đăng nhập để xem thông tin!";
        return;
      }

      const response = await axios.get(
        `${urlHost}/api/Controller_MemberInfo/Get_All_courseIntake`,
        { headers }
      );

      courseIntakes.value = response.data;
      return response.data;
    } catch (err) {
      error.value = "❌ Có lỗi xảy ra khi lấy danh sách khóa học!";
      console.error("Error fetching course intakes:", err);
      return null;
    }
  };

  return {
    error,
    majors,
    membersByMajor,
    courseIntakes,
    getMajor,
    getMembersByMajor,
    searchMembersByMajor,
    getCourseIntakes,
    MAJOR_CODE_MAPPING
  };
});